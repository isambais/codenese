import io
from flask import Blueprint, request, jsonify, send_file

from analysis.language_detector import detect_language
from analysis.features import extract_features
from analysis.explainability import compute_shap_values
from models.ml_models import predict_quality_ml, get_model_metrics
from models.completion import complete_code
from reports.pdf_report import generate_pdf

api_bp = Blueprint('api', __name__)


def _full_analysis(code: str) -> dict:
    features = extract_features(code)
    language = detect_language(code)
    quality  = predict_quality_ml(features)
    shap     = compute_shap_values(features)
    return {'language': language, 'features': features, 'quality': quality, 'shap': shap}


@api_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json(silent=True) or {}
    code = data.get('code', '').strip()
    if not code:
        return jsonify({'error': 'code is required'}), 400
    return jsonify(_full_analysis(code))


@api_bp.route('/predict/language', methods=['POST'])
def predict_language():
    data = request.get_json(silent=True) or {}
    code = data.get('code', '')
    return jsonify(detect_language(code))


@api_bp.route('/predict/quality', methods=['POST'])
def predict_quality():
    data = request.get_json(silent=True) or {}
    code = data.get('code', '').strip()
    if not code:
        return jsonify({'error': 'code is required'}), 400
    features = extract_features(code)
    quality  = predict_quality_ml(features)
    shap     = compute_shap_values(features)
    return jsonify({**quality, 'shap': shap})


@api_bp.route('/complete', methods=['POST'])
def code_complete():
    data  = request.get_json(silent=True) or {}
    code  = data.get('code', '')
    top_k = int(data.get('top_k', 6))
    return jsonify(complete_code(code, top_k))


@api_bp.route('/report', methods=['POST'])
def generate_report():
    data = request.get_json(silent=True) or {}
    code = data.get('code', '').strip()
    if not code:
        return jsonify({'error': 'code is required'}), 400
    analysis  = _full_analysis(code)
    pdf_bytes = generate_pdf(analysis)
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype='application/pdf',
        as_attachment=True,
        download_name='codesense_report.pdf',
    )


@api_bp.route('/models', methods=['GET'])
def list_models():
    return jsonify(get_model_metrics())


@api_bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'version': '1.0'})
