from radon.complexity import cc_visit

def calculate_complexity(code):
    try:
        results = cc_visit(code)
        if len(results) == 0:
            return 1
        
        return results[0].complexity
    except:
        return 1