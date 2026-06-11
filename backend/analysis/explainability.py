def compute_shap_values(features: dict) -> dict:
    """
    Heuristic SHAP-style feature importances.
    Normalized to [0, 1] — higher = stronger signal for the model prediction.
    """
    cc          = features.get('cyclomatic_complexity', 1)
    max_indent  = features.get('max_indent', 0)
    token_dens  = features.get('token_density', 0)
    special     = features.get('special_chars', 0)
    avg_line    = features.get('avg_line_length', 0)
    py_kw       = features.get('py_keywords', 0)

    raw = {
        'Girinti derinliği': min(max_indent / 20.0, 1.0),
        'Anahtar kelimeler': min(py_kw / 12.0, 1.0),
        'Token yoğunluğu':   min(token_dens / 15.0, 1.0),
        'Özel karakterler':  min(special / 60.0, 1.0),
        'Satır uzunluğu':    min(avg_line / 120.0, 1.0),
        'Cyclomatic CC':     min(cc / 10.0, 1.0),
    }

    sorted_vals = dict(sorted(raw.items(), key=lambda x: x[1], reverse=True))

    lime_labels = []
    for feat, val in list(sorted_vals.items())[:4]:
        if val >= 0.65:
            color = 'red'
        elif val >= 0.35:
            color = 'amber'
        else:
            color = 'green'
        lime_labels.append({'label': feat, 'value': round(val, 2), 'color': color})

    return {
        'shap_values': {k: round(v, 2) for k, v in sorted_vals.items()},
        'lime_labels': lime_labels,
    }
