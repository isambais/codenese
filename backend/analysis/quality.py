def calculate_quality_score(complexity: int) -> int:
    score = 100 - (complexity * 5)
    return max(0, min(100, score))
