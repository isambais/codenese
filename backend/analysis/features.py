import re
from radon.complexity import cc_visit

PY_KW  = {'def','class','import','from','return','if','else','elif','for','while','try','except','with','lambda','yield','pass','raise'}
JS_KW  = {'function','const','let','var','return','if','else','for','while','class','import','export','async','await','typeof','instanceof'}
JAVA_KW= {'public','private','class','static','void','return','import','new','interface','extends','implements','throws','final','abstract'}
CPP_KW = {'include','int','void','return','class','public','private','namespace','template','using','struct','auto','nullptr'}


def extract_features(code: str) -> dict:
    lines = code.splitlines()
    non_empty = [l for l in lines if l.strip()]

    # Indent
    indents = [len(l) - len(l.lstrip()) for l in non_empty]
    max_indent = max(indents, default=0)
    avg_indent = round(sum(indents) / len(indents), 2) if indents else 0

    # Tokens
    tokens = re.findall(r'\b\w+\b', code)
    token_count = len(tokens)
    token_density = round(token_count / len(lines), 2) if lines else 0

    # Keywords
    py_kw   = sum(1 for t in tokens if t in PY_KW)
    js_kw   = sum(1 for t in tokens if t in JS_KW)
    java_kw = sum(1 for t in tokens if t in JAVA_KW)
    cpp_kw  = sum(1 for t in tokens if t in CPP_KW)

    # Special chars
    special_chars = len(re.findall(r'[{}()\[\];,]', code))

    # Line lengths
    line_lengths = [len(l) for l in lines]
    avg_line_length = round(sum(line_lengths) / len(line_lengths), 2) if line_lengths else 0
    max_line_length = max(line_lengths, default=0)

    # Comments
    comment_lines = len([l for l in lines if l.strip().startswith('#') or l.strip().startswith('//')])

    # Cyclomatic complexity
    try:
        cc_results = cc_visit(code)
        cyclomatic = sum(r.complexity for r in cc_results) if cc_results else 1
    except Exception:
        cyclomatic = 1

    return {
        'line_count':           len(lines),
        'non_empty_lines':      len(non_empty),
        'max_indent':           max_indent,
        'avg_indent':           avg_indent,
        'token_count':          token_count,
        'token_density':        token_density,
        'special_chars':        special_chars,
        'avg_line_length':      avg_line_length,
        'max_line_length':      max_line_length,
        'comment_lines':        comment_lines,
        'py_keywords':          py_kw,
        'js_keywords':          js_kw,
        'java_keywords':        java_kw,
        'cpp_keywords':         cpp_kw,
        'cyclomatic_complexity': cyclomatic,
    }
