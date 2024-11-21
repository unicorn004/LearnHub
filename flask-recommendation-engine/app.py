from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from sentence_transformers import SentenceTransformer, util
import torch

# Initialize Flask app
app = Flask(__name__)

# Load models
t5_model_name = "t5-small"
tokenizer = AutoTokenizer.from_pretrained(t5_model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(t5_model_name)
sentence_model = SentenceTransformer("all-MiniLM-L6-v2")

# Global topics dictionary
global_topics = {}


def extract_topics(text, max_topics=5):
    """
    Extract topics from a given text using T5 model.
    """
    input_text = f"Extract topics: {text}"
    inputs = tokenizer.encode(input_text, return_tensors="pt", truncation=True)
    outputs = model.generate(inputs, max_length=50, num_return_sequences=max_topics, do_sample=True)
    topics = [tokenizer.decode(output, skip_special_tokens=True) for output in outputs]
    return list(set(topics))  # Remove duplicates


def add_to_global_topics(new_topics):
    """
    Add new topics to the global topic dictionary, ensuring uniqueness.
    """
    for topic in new_topics:
        topic_embedding = sentence_model.encode(topic, convert_to_tensor=True)
        is_duplicate = any(util.cos_sim(topic_embedding, emb) > 0.7 for emb in global_topics.values())
        if not is_duplicate:
            global_topics[topic] = topic_embedding


def compute_relevance_scores(text, topics):
    """
    Compute relevance scores between a text and the global topics.
    """
    text_embedding = sentence_model.encode(text, convert_to_tensor=True)
    scores = {topic: util.cos_sim(text_embedding, emb).item() for topic, emb in topics.items()}
    return scores


def recommend(user_text, global_topics, group_texts=[], resource_texts=[]):
    """
    Generate recommendations for a user based on topic relevance.
    """
    user_scores = compute_relevance_scores(user_text, global_topics)
    recommendations = {"groups": [], "resources": []}

    for group in group_texts:
        group_scores = compute_relevance_scores(group, global_topics)
        score = sum(user_scores[topic] * group_scores.get(topic, 0) for topic in user_scores)
        recommendations["groups"].append((group, score))

    for resource in resource_texts:
        resource_scores = compute_relevance_scores(resource, global_topics)
        score = sum(user_scores[topic] * resource_scores.get(topic, 0) for topic in user_scores)
        recommendations["resources"].append((resource, score))

    # Sort recommendations by score
    recommendations["groups"] = sorted(recommendations["groups"], key=lambda x: x[1], reverse=True)
    recommendations["resources"] = sorted(recommendations["resources"], key=lambda x: x[1], reverse=True)

    return recommendations


@app.route("/initialize-topics", methods=["POST"])
def initialize_topics():
    """
    Add initial topics to the global topic dictionary.
    """
    data = request.json
    texts = data.get("texts", [])
    for text in texts:
        topics = extract_topics(text)
        add_to_global_topics(topics)
    return jsonify({"message": "Topics initialized successfully.", "topics": list(global_topics.keys())})


@app.route("/recommend", methods=["POST"])
def recommend_api():
    """
    Generate recommendations for a user based on input.
    """
    data = request.json
    user_text = data.get("user_text", "")
    group_texts = data.get("group_texts", [])
    resource_texts = data.get("resource_texts", [])

    recommendations = recommend(user_text, global_topics, group_texts, resource_texts)
    return jsonify({
        "groups": recommendations["groups"],
        "resources": recommendations["resources"]
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
