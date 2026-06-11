try:
    from pygments.lexers import guess_lexer
    from pygments.util import ClassNotFound
    HAS_PYGMENTS = True
except ImportError:
    HAS_PYGMENTS = False

# Signature weights: (substring, weight)
SIGNATURES: dict[str, list[tuple[str, int]]] = {
    'Python':     [('def ', 3), ('import ', 2), ('from ', 2), ('elif ', 4), ('self.', 3),
                   ('__init__', 4), ('print(', 2), (':\n', 1), ('#', 1)],
    'JavaScript': [('function ', 3), ('const ', 3), ('let ', 3), ('var ', 2), ('=>', 4),
                   ('console.log', 4), ('document.', 3), ('require(', 3), ('===', 3)],
    'TypeScript': [('interface ', 4), (': string', 3), (': number', 3), (': boolean', 3),
                   ('type ', 2), ('<T>', 3), ('as const', 4), ('?.', 2)],
    'Java':       [('public class', 5), ('public static void main', 6), ('System.out.', 5),
                   ('import java.', 4), ('extends ', 2), ('implements ', 2), ('new ', 1)],
    'C++':        [('#include', 4), ('std::', 4), ('cout <<', 5), ('cin >>', 5),
                   ('namespace ', 3), ('::', 2), ('nullptr', 4)],
    'C':          [('#include <stdio.h>', 6), ('printf(', 4), ('scanf(', 4),
                   ('malloc(', 4), ('free(', 3), ('int main', 4)],
    'Go':         [('func ', 3), ('package ', 4), ('import (', 3), ('fmt.Println', 5),
                   (':= ', 3), ('go func', 5), ('chan ', 3)],
    'Rust':       [('fn ', 3), ('let mut', 4), ('println!', 5), ('use std::', 4),
                   ('impl ', 3), ('-> ', 2), ('match ', 3)],
    'Ruby':       [('def ', 2), ('puts ', 4), ('require ', 2), ('attr_', 4),
                   ('end\n', 3), ('do |', 4), ('.each', 3)],
    'PHP':        [('<?php', 6), ('echo ', 3), ('$', 2), ('->', 2), ('function ', 2)],
    'Swift':      [('func ', 3), ('import UIKit', 6), ('override func', 5),
                   ('guard ', 4), ('let ', 2), ('var ', 2)],
    'Kotlin':     [('fun ', 3), ('val ', 3), ('println(', 4), ('data class ', 5),
                   ('?.', 3), ('?.let {', 4)],
}


def detect_language(code: str) -> dict:
    scores: dict[str, int] = {}
    for lang, sigs in SIGNATURES.items():
        s = sum(w for pat, w in sigs if pat in code)
        if s > 0:
            scores[lang] = s

    if not scores and HAS_PYGMENTS:
        try:
            lexer = guess_lexer(code)
            return {
                'language':   lexer.name,
                'confidence': 0.65,
                'all_scores': {},
            }
        except ClassNotFound:
            pass

    if not scores:
        return {'language': 'Unknown', 'confidence': 0.0, 'all_scores': {}}

    total = sum(scores.values())
    best  = max(scores, key=scores.get)
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    return {
        'language':   best,
        'confidence': round(scores[best] / total, 3),
        'all_scores': {k: round(v / total, 3) for k, v in sorted_scores[:5]},
    }
