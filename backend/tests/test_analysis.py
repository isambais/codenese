import pytest
from analysis.features import extract_features
from analysis.language_detector import detect_language
from analysis.explainability import compute_shap_values
from models.ml_models import predict_quality_ml

PY_CODE = """def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
"""

JS_CODE = """function greet(name) {
    const msg = `Hello, ${name}`;
    console.log(msg);
    return msg;
}
"""


class TestFeatureExtraction:
    def test_returns_all_keys(self):
        f = extract_features(PY_CODE)
        for key in ['line_count', 'cyclomatic_complexity', 'max_indent',
                    'token_count', 'py_keywords', 'special_chars']:
            assert key in f

    def test_line_count(self):
        f = extract_features(PY_CODE)
        assert f['line_count'] == len(PY_CODE.splitlines())

    def test_cyclomatic_complexity_positive(self):
        f = extract_features(PY_CODE)
        assert f['cyclomatic_complexity'] >= 1

    def test_python_keywords_detected(self):
        f = extract_features(PY_CODE)
        assert f['py_keywords'] > 0

    def test_empty_code(self):
        f = extract_features('')
        assert f['line_count'] == 0
        assert f['cyclomatic_complexity'] >= 1


class TestLanguageDetector:
    def test_detects_python(self):
        result = detect_language(PY_CODE)
        assert result['language'] == 'Python'
        assert result['confidence'] > 0.5

    def test_detects_javascript(self):
        result = detect_language(JS_CODE)
        assert result['language'] == 'JavaScript'

    def test_unknown_returns_dict(self):
        result = detect_language('xyz 123 !!!')
        assert 'language' in result
        assert 'confidence' in result

    def test_confidence_range(self):
        result = detect_language(PY_CODE)
        assert 0.0 <= result['confidence'] <= 1.0


class TestQualityPrediction:
    def test_simple_code_low_risk(self):
        f = extract_features("x = 1\nprint(x)\n")
        q = predict_quality_ml(f)
        assert q['bug_risk'] in ('Low', 'Medium', 'High')
        assert 0 <= q['quality_score'] <= 100
        assert 0.0 <= q['risk_score'] <= 1.0

    def test_complex_code_lower_score(self):
        complex_code = "def f(a,b,c,d,e):\n" + "    if a:\n" * 10 + "        return 1\n"
        simple_code  = "def f(x):\n    return x\n"
        q_complex = predict_quality_ml(extract_features(complex_code))
        q_simple  = predict_quality_ml(extract_features(simple_code))
        assert q_complex['quality_score'] <= q_simple['quality_score']


class TestExplainability:
    def test_shap_keys_present(self):
        f = extract_features(PY_CODE)
        s = compute_shap_values(f)
        assert 'shap_values' in s
        assert 'lime_labels' in s

    def test_shap_values_in_range(self):
        f = extract_features(PY_CODE)
        s = compute_shap_values(f)
        for val in s['shap_values'].values():
            assert 0.0 <= val <= 1.0
