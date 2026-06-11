import pytest
from app import create_app

PY_CODE = "def hello():\n    return 'world'\n"


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as c:
        yield c


class TestHealthEndpoint:
    def test_health_ok(self, client):
        r = client.get('/api/v1/health')
        assert r.status_code == 200
        assert r.get_json()['status'] == 'ok'


class TestAnalyzeEndpoint:
    def test_analyze_returns_200(self, client):
        r = client.post('/api/v1/analyze', json={'code': PY_CODE})
        assert r.status_code == 200

    def test_analyze_response_structure(self, client):
        r = client.post('/api/v1/analyze', json={'code': PY_CODE})
        data = r.get_json()
        assert 'language' in data
        assert 'quality' in data
        assert 'features' in data
        assert 'shap' in data

    def test_analyze_detects_python(self, client):
        r = client.post('/api/v1/analyze', json={'code': PY_CODE})
        assert r.get_json()['language']['language'] == 'Python'

    def test_analyze_empty_code_returns_400(self, client):
        r = client.post('/api/v1/analyze', json={'code': ''})
        assert r.status_code == 400

    def test_analyze_missing_code_returns_400(self, client):
        r = client.post('/api/v1/analyze', json={})
        assert r.status_code == 400


class TestModelsEndpoint:
    def test_models_returns_list(self, client):
        r = client.get('/api/v1/models')
        assert r.status_code == 200
        data = r.get_json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_models_have_required_fields(self, client):
        r = client.get('/api/v1/models')
        for m in r.get_json():
            assert 'name' in m
            assert 'accuracy' in m
            assert 'f1' in m


class TestLanguageEndpoint:
    def test_predict_language(self, client):
        r = client.post('/api/v1/predict/language', json={'code': PY_CODE})
        assert r.status_code == 200
        assert 'language' in r.get_json()


class TestCompleteEndpoint:
    def test_complete_returns_suggestions(self, client):
        r = client.post('/api/v1/complete', json={'code': 'x = a [MASK] b'})
        assert r.status_code == 200
        data = r.get_json()
        assert 'suggestions' in data
        assert len(data['suggestions']) > 0

    def test_complete_no_mask_returns_error(self, client):
        r = client.post('/api/v1/complete', json={'code': 'x = 1'})
        data = r.get_json()
        assert 'error' in data
