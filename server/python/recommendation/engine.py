def run_recommendation_pipeline(user_text, group_texts=[], resource_texts=[]):
    """
    Run the full recommendation pipeline for a user.
    """
    print("\n--- Running Recommendation Pipeline ---\n")
    # Process new user
    process_new_entry(user_text, entity_type="user")
    user_scores = compute_relevance_for_entity(user_text)

    # Process groups and resources
    recommendations = {"groups": [], "resources": []}

    for group_text in group_texts:
        process_new_entry(group_text, entity_type="group")
        group_scores = compute_relevance_for_entity(group_text)
        score = sum(user_scores[topic] * group_scores.get(topic, 0) for topic in user_scores)
        recommendations["groups"].append((group_text, score))

    for resource_text in resource_texts:
        process_new_entry(resource_text, entity_type="resource")
        resource_scores = compute_relevance_for_entity(resource_text)
        score = sum(user_scores[topic] * resource_scores.get(topic, 0) for topic in user_scores)
        recommendations["resources"].append((resource_text, score))

    # Sort recommendations
    recommendations["groups"] = sorted(recommendations["groups"], key=lambda x: x[1], reverse=True)
    recommendations["resources"] = sorted(recommendations["resources"], key=lambda x: x[1], reverse=True)

    # Print results
    print("\nRecommended Groups:")
    for group, score in recommendations["groups"]:
        print(f"{group} (Score: {score:.2f})")

    print("\nRecommended Resources:")
    for resource, score in recommendations["resources"]:
        print(f"{resource} (Score: {score:.2f})")

    return recommendations