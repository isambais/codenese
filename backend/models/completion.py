import os
import requests

HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/codebert-base"

_FALLBACK: dict[str, list] = {
    'operator':  ['+', '-', '*', '/', '**', '%'],
    'keyword':   ['return', 'pass', 'None', 'True', 'False'],
    'default':   ['+', '-', '*', '/', 'return', 'None'],
}

def _fallback_suggestions(code: str) -> list:
    tokens = ['+', '-', '*', '/', '**', '%', 'return', 'pass', 'None']
    return [{'token': t, 'score': round(0.95 - i * 0.08, 2)} for i, t in enumerate(tokens[:6])]


def complete_code(code: str, top_k: int = 6) -> dict:
    if '[MASK]' not in code:
        return {'error': 'Code must contain [MASK] token', 'suggestions': []}

    api_key = os.environ.get('HF_API_KEY', '')

    if api_key:
        try:
            headers = {'Authorization': f'Bearer {api_key}'}
            payload = {'inputs': code, 'parameters': {'top_k': top_k}}
            resp = requests.post(HF_API_URL, headers=headers, json=payload, timeout=15)
            if resp.status_code == 200:
                results = resp.json()
                if isinstance(results, list):
                    suggestions = [
                        {'token': r.get('token_str', '').strip(), 'score': round(r.get('score', 0), 4)}
                        for r in results
                    ]
                    return {'suggestions': suggestions, 'model': 'codebert-base', 'source': 'huggingface'}
        except Exception:
            pass

    return {
        'suggestions': _fallback_suggestions(code),
        'model':  'local-fallback',
        'source': 'heuristic',
    }
