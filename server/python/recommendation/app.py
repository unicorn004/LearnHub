from flask import Flask, request, jsonify
from engine import run_recommendation_pipeline

app = Flask(__name__)

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_text = data.get('user_text', '')
    group_texts = data.get('group_texts', [])
    resource_texts = data.get('resource_texts', [])
    
    if not user_text:
        return jsonify({"error": "User text is required"}), 400
    
    recommendations = run_recommendation_pipeline(user_text, group_texts, resource_texts)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(port=5001, debug=True)