from generator.generator import Generator
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS

api_blueprint = Blueprint("api", __name__, url_prefix="/api")
ai_blueprint = Blueprint("ai", __name__, url_prefix="/ai")
api_blueprint.register_blueprint(ai_blueprint)
generator = Generator()


@ai_blueprint.route("/generate", methods=["POST"])
def generate_suggestion():
    data = request.get_json()
    prompt = data.get("prompt")
    length = data.get("length")

    suggestion = generator.generate(prompt, length)
    return jsonify({"suggestion": suggestion})


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})
    app.register_blueprint(api_blueprint)
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
