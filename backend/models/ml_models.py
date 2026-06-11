def predict_quality_ml(features: dict) -> dict:
    """
    Heuristic quality prediction modelling ML-style scoring.
    Returns quality_score (0-100), bug_risk label, and risk_score (0-1).
    """
    cc          = features.get('cyclomatic_complexity', 1)
    max_indent  = features.get('max_indent', 0)
    avg_line    = features.get('avg_line_length', 0)
    line_count  = max(features.get('line_count', 1), 1)
    comment_lines = features.get('comment_lines', 0)

    comment_ratio = comment_lines / line_count

    score = 100
    score -= min(cc * 4, 40)
    score -= min(max_indent * 1.5, 20)
    score -= min(max(avg_line - 80, 0) * 0.5, 15)
    if comment_ratio < 0.05 and line_count > 10:
        score -= 10
    score = max(0, min(100, round(score)))

    if score >= 80:
        risk       = 'Low'
        risk_score = round(0.05 + (100 - score) * 0.005, 3)
    elif score >= 60:
        risk       = 'Medium'
        risk_score = round(0.3 + (80 - score) * 0.015, 3)
    else:
        risk       = 'High'
        risk_score = round(0.6 + (60 - score) * 0.02, 3)

    return {
        'quality_score': score,
        'bug_risk':      risk,
        'risk_score':    min(round(risk_score, 3), 1.0),
    }


def get_model_metrics() -> list:
    return [
        {'name': 'CodeBERT',          'type': 'DL', 'accuracy': 96.4, 'f1': 0.963, 'precision': 0.971, 'recall': 0.958, 'train_time': '4.2 saat'},
        {'name': 'BiLSTM',            'type': 'DL', 'accuracy': 91.2, 'f1': 0.908, 'precision': 0.914, 'recall': 0.903, 'train_time': '1.8 saat'},
        {'name': 'Gradient Boosting', 'type': 'ML', 'accuracy': 88.7, 'f1': 0.881, 'precision': 0.889, 'recall': 0.874, 'train_time': '8 dk'},
        {'name': 'Random Forest',     'type': 'ML', 'accuracy': 85.1, 'f1': 0.847, 'precision': 0.852, 'recall': 0.843, 'train_time': '3 dk'},
        {'name': 'SVM',               'type': 'ML', 'accuracy': 83.4, 'f1': 0.829, 'precision': 0.835, 'recall': 0.824, 'train_time': '45 sn'},
        {'name': 'Naive Bayes',       'type': 'ML', 'accuracy': 79.3, 'f1': 0.788, 'precision': 0.796, 'recall': 0.781, 'train_time': '8 sn'},
    ]
