import os
import tempfile

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from groq import Groq
from tavily import TavilyClient
from pypdf import PdfReader


app = FastAPI(title="NovaAI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://novaai-frontend-g68t.onrender.com",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# CORS
# =========================================================




# =========================================================
# API CLIENTS
# =========================================================

groq_client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

tavily_client = TavilyClient(
    api_key=os.environ.get("TAVILY_API_KEY")
)


# =========================================================
# DOCUMENT STORAGE
# =========================================================

document_text = ""
document_name = ""
document_pages = 0


# =========================================================
# REQUEST MODEL
# =========================================================

class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "NovaAI backend is running!"
    }


# =========================================================
# DOCUMENT STATUS
# =========================================================

@app.get("/document-status")
def document_status():

    return {
        "document_loaded": bool(document_text),
        "document_name": document_name,
        "pages": document_pages,
        "characters": len(document_text),
    }


# =========================================================
# CLEAR DOCUMENT
# =========================================================

@app.post("/clear-document")
def clear_document():

    global document_text
    global document_name
    global document_pages

    document_text = ""
    document_name = ""
    document_pages = 0

    print()
    print("=" * 60)
    print("DOCUMENT CLEARED")
    print("NovaAI is now in normal AI mode.")
    print("=" * 60)
    print()

    return {
        "success": True,
        "message": "Document cleared successfully.",
    }


# =========================================================
# WEB SEARCH
# =========================================================

def search_web(query):

    results = tavily_client.search(
        query=query,
        search_depth="basic",
        max_results=5,
    )

    return results.get(
        "results",
        []
    )


# =========================================================
# SMART SUGGESTIONS
# =========================================================

def generate_suggestions(
    question,
    answer,
    document_mode=False
):

    try:

        mode = (
            "The user is asking about an uploaded document."
            if document_mode
            else
            "The user is having a normal AI conversation."
        )

        suggestion_prompt = f"""
You are generating follow-up suggestions for NovaAI.

{mode}

USER QUESTION:
{question}

NOVA AI ANSWER:
{answer}

Generate exactly 3 useful follow-up suggestions.

The suggestions must:
- Be directly related to the user's question.
- Help the user continue their task.
- Be different from each other.
- Be short.
- Be natural questions or requests.
- Not repeat the original question.
- Not mention that you are generating suggestions.
- Not use numbering.
- Not use bullet points.
- Return ONLY the 3 suggestions separated by a newline.

Examples:

Compare this with AWS
Give me a real-world example
Explain this for an interview
"""

        completion = (
            groq_client
            .chat
            .completions
            .create(

                model="openai/gpt-oss-20b",

                messages=[

                    {
                        "role": "system",
                        "content": """
You create concise, useful follow-up
questions for an AI assistant.

Always return exactly three suggestions,
one per line.
Do not add numbering or explanations.
""",
                    },

                    {
                        "role": "user",
                        "content": suggestion_prompt,
                    },

                ],

            )
        )

        raw_suggestions = (
            completion
            .choices[0]
            .message
            .content
            .strip()
        )

        suggestions = []

        for line in raw_suggestions.splitlines():

            cleaned = (
                line
                .strip()
                .lstrip("-")
                .lstrip("•")
                .strip()
            )

            if cleaned:

                # Remove simple numbering
                if len(cleaned) > 2:
                    if cleaned[0].isdigit() and cleaned[1] in ".):":
                        cleaned = cleaned[2:].strip()

                suggestions.append(cleaned)

        suggestions = suggestions[:3]

        if len(suggestions) == 3:
            return suggestions

        return [
            "Explain this in simpler terms",
            "Give me a real-world example",
            "What should I learn next?"
        ]

    except Exception as error:

        print(
            "Suggestion generation error:",
            error
        )

        return [
            "Explain this in simpler terms",
            "Give me a real-world example",
            "What should I learn next?"
        ]


# =========================================================
# PDF UPLOAD
# =========================================================

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...)
):

    global document_text
    global document_name
    global document_pages

    filename = file.filename or ""

    print()
    print("=" * 60)
    print("NEW FILE UPLOAD")
    print("Filename:", filename)
    print("=" * 60)

    # -----------------------------------------------------
    # PDF CHECK
    # -----------------------------------------------------

    if not filename.lower().endswith(".pdf"):

        print("ERROR: File is not a PDF")

        return {
            "success": False,
            "message": "Please upload a PDF file."
        }

    try:

        # -------------------------------------------------
        # Read uploaded file
        # -------------------------------------------------

        contents = await file.read()

        print(
            "Uploaded bytes:",
            len(contents)
        )

        # -------------------------------------------------
        # Save temporarily
        # -------------------------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_file:

            temp_file.write(contents)

            temp_path = temp_file.name

        # -------------------------------------------------
        # Extract PDF text
        # -------------------------------------------------

        reader = PdfReader(temp_path)

        extracted_text = ""

        for page_number, page in enumerate(
            reader.pages,
            start=1
        ):

            try:

                page_text = page.extract_text()

                if page_text:

                    extracted_text += (
                        page_text + "\n"
                    )

            except Exception as error:

                print(
                    f"Page {page_number} extraction error:",
                    error
                )

        # -------------------------------------------------
        # Remove temporary file
        # -------------------------------------------------

        try:
            os.remove(temp_path)

        except Exception:
            pass

        # -------------------------------------------------
        # Save document
        # -------------------------------------------------

        document_name = filename

        document_pages = len(
            reader.pages
        )

        document_text = extracted_text.strip()

        print(
            "Pages:",
            document_pages
        )

        print(
            "Extracted characters:",
            len(document_text)
        )

        # -------------------------------------------------
        # Check extracted text
        # -------------------------------------------------

        if not document_text:

            print(
                "WARNING: PDF contains no extractable text."
            )

            return {
                "success": False,
                "message": (
                    "I could not extract text from "
                    "this PDF. It may be a scanned/image PDF."
                ),
                "pages": document_pages,
                "characters": 0,
            }

        print(
            "DOCUMENT SUCCESSFULLY LOADED"
        )

        print("=" * 60)
        print()

        return {

            "success": True,

            "filename": filename,

            "pages": document_pages,

            "characters": len(
                document_text
            ),

            "message": (
                f"{filename} uploaded successfully."
            ),

        }

    except Exception as error:

        print()
        print(
            "PDF PROCESSING ERROR:",
            error
        )
        print()

        return {

            "success": False,

            "message": (
                "Something went wrong while "
                "reading the PDF."
            ),

        }


# =========================================================
# CHAT
# =========================================================

@app.post("/chat")
def chat(
    request: ChatRequest
):

    global document_text
    global document_name

    question = request.message.strip()

    history = request.history or []

    print()
    print("-" * 60)
    print("NEW CHAT")
    print("Question:", question)

    print(
        "Conversation messages:",
        len(history)
    )

    print(
        "Document loaded:",
        bool(document_text)
    )

    if document_name:

        print(
            "Document:",
            document_name
        )

    print(
        "Document characters:",
        len(document_text)
    )

    print("-" * 60)


    # =====================================================
    # DOCUMENT MODE
    # =====================================================

    if document_text:

        print(
            ">>> DOCUMENT MODE ACTIVE <<<"
        )

        document_context = (
            document_text[:30000]
        )

        # -------------------------------------------------
        # Conversation history
        # -------------------------------------------------

        conversation_text = ""

        for item in history[-10:]:

            role = item.get(
                "role",
                ""
            )

            content = item.get(
                "content",
                ""
            )

            if role and content:

                conversation_text += (
                    f"{role.upper()}: "
                    f"{content}\n\n"
                )

        prompt = f"""
You are NovaAI's document analysis assistant.

DOCUMENT NAME:
{document_name}

DOCUMENT CONTENT:
----------------
{document_context}
----------------

PREVIOUS CONVERSATION:
----------------
{conversation_text}
----------------

CURRENT USER QUESTION:
{question}

Instructions:

1. Answer the current question using the document.
2. Use previous conversation when relevant.
3. Carefully use the document content.
4. Do not say that you cannot access the document.
5. Do not ask the user to upload the document again.
6. Do not invent information.
7. If information is not present, clearly say
   that it could not be found in the document.
8. For summaries, cover important sections
   and concepts.
9. Point out useful insights when appropriate.
10. If there are multiple interpretations,
    explain them clearly.
11. Think about what the user is trying to accomplish.
12. When useful, suggest practical next steps.
"""

        completion = (
            groq_client
            .chat
            .completions
            .create(

                model="openai/gpt-oss-20b",

                messages=[

                    {
                        "role": "system",

                        "content": """
You are NovaAI, an intelligent document
analysis assistant.

Be accurate, helpful, proactive,
and easy to understand.

Act as a thinking partner.

You may point out important insights,
recommendations, risks, opportunities,
and useful next steps based on the
document.

Do not reveal private chain-of-thought.
Provide conclusions and useful reasoning
instead.
""",
                    },

                    {
                        "role": "user",

                        "content": prompt,
                    },

                ],

            )
        )

        answer = (
            completion
            .choices[0]
            .message
            .content
        )

        print(
            ">>> DOCUMENT ANSWER GENERATED <<<"
        )

        # -------------------------------------------------
        # SMART DOCUMENT SUGGESTIONS
        # -------------------------------------------------

        suggestions = generate_suggestions(
            question,
            answer,
            document_mode=True
        )

        print(
            "Suggestions:",
            suggestions
        )

        return {

            "response": answer,

            "sources": [],

            "web_search_used": False,

            "document_used": True,

            "suggestions": suggestions,

        }


    # =====================================================
    # NORMAL AI MODE
    # =====================================================

    print(
        ">>> NORMAL AI MODE <<<"
    )


    # =====================================================
    # WEB SEARCH DECISION
    # =====================================================

    decision = (
        groq_client
        .chat
        .completions
        .create(

            model="openai/gpt-oss-20b",

            messages=[

                {

                    "role": "system",

                    "content": """
Decide whether the user's question requires
current internet information.

Reply ONLY YES or NO.

Use YES for:

- current news
- today's information
- current prices
- recent events
- recent developments
- current technology information
- information that may have changed

Use NO for:

- general knowledge
- explanations
- writing
- mathematics
- coding
- brainstorming
- stable facts
""",
                },

                {

                    "role": "user",

                    "content": question,
                },

            ],

        )
    )

    needs_web = (

        decision
        .choices[0]
        .message
        .content
        .strip()
        .upper()
        .startswith("YES")

    )

    sources = []


    # =====================================================
    # WEB MODE
    # =====================================================

    if needs_web:

        print(
            ">>> WEB SEARCH ACTIVE <<<"
        )

        web_results = search_web(
            question
        )

        context_parts = []

        for result in web_results:

            title = result.get(
                "title",
                ""
            )

            content = result.get(
                "content",
                ""
            )

            url = result.get(
                "url",
                ""
            )

            context_parts.append(

                f"TITLE: {title}\n"
                f"CONTENT: {content}\n"
                f"URL: {url}"

            )

            sources.append({

                "title": title,

                "url": url,

            })

        web_context = (
            "\n\n---\n\n"
            .join(context_parts)
        )

        prompt = f"""
Answer the user's question using the web research.

PREVIOUS CONVERSATION:
----------------
{history[-10:]}
----------------

CURRENT USER QUESTION:
{question}

WEB RESEARCH:
{web_context}

Instructions:

- Use previous conversation when relevant.
- Give a clear answer.
- Prefer information supported by sources.
- Do not invent facts.
- If sources disagree, mention it.
- Think about what the user is trying to accomplish.
- When useful, give a recommendation.
- When useful, suggest a logical next step.
"""

    # =====================================================
    # GENERAL AI MODE
    # =====================================================

    else:

        print(
            ">>> GENERAL AI MODE <<<"
        )

        conversation_text = ""

        for item in history[-10:]:

            role = item.get(
                "role",
                ""
            )

            content = item.get(
                "content",
                ""
            )

            if role and content:

                conversation_text += (
                    f"{role.upper()}: "
                    f"{content}\n\n"
                )

        prompt = f"""
PREVIOUS CONVERSATION:
----------------
{conversation_text}
----------------

CURRENT USER MESSAGE:
{question}

Use previous conversation when relevant.

Think about what the user is actually
trying to accomplish.

Answer naturally and helpfully.
"""


    # =====================================================
    # GENERATE FINAL ANSWER
    # =====================================================

    completion = (
        groq_client
        .chat
        .completions
        .create(

            model="openai/gpt-oss-20b",

            messages=[

                {

                    "role": "system",

                    "content": """
You are NovaAI, a thoughtful, proactive,
and intelligent AI assistant.

Your job is not only to answer questions.
You are also a useful thinking partner.

Use conversation history to understand
follow-up questions.

When appropriate:

- Think about what the user is actually
  trying to accomplish.
- Suggest useful ideas they may not have
  considered.
- Give alternatives when appropriate.
- Recommend the strongest option.
- Explain why you recommend it.
- Break complicated problems into simple steps.
- Point out important considerations.
- Suggest practical next steps.
- Help the user make decisions.
- For brainstorming, provide several ideas
  and identify the strongest one.
- Improve the user's idea when useful.
- Be proactive without overwhelming the user.
- Never invent facts.
- If uncertain, say so.

Do not reveal private chain-of-thought
or hidden reasoning.

Instead, provide useful conclusions,
recommendations, explanations,
and practical steps.

Act like a helpful AI thinking partner,
not just a question-and-answer machine.
""",
                },

                {

                    "role": "user",

                    "content": prompt,
                },

            ],

        )
    )

    answer = (
        completion
        .choices[0]
        .message
        .content
    )

    print(
        ">>> ANSWER GENERATED <<<"
    )


    # =====================================================
    # SMART NORMAL-MODE SUGGESTIONS
    # =====================================================

    suggestions = generate_suggestions(
        question,
        answer,
        document_mode=False
    )

    print(
        "Suggestions:",
        suggestions
    )


    # =====================================================
    # FINAL RESPONSE
    # =====================================================

    return {

        "response": answer,

        "sources": sources,

        "web_search_used": needs_web,

        "document_used": False,

        "suggestions": suggestions,

    }