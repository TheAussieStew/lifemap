import { expect, test } from 'vitest'
import { BoxedExpression, ComputeEngine } from '@cortex-js/compute-engine';


test('adds 1 + 1 to equal 2', () => {
    const sum = (a: number, b: number) => {
        return a + b
    }
    expect(sum(1, 1)).toBe(2)
})

test('evaluation of equation containing exponentials is correct', () => {
    // Consider an equation that has an exponential evaluation
    const latexEquation = "100^2 + 100"

    const ce = new ComputeEngine();

    let expression: BoxedExpression = ce.parse(latexEquation);

    expect(expression.N().latex).toBe(10000+100)
})