import { useEffect } from 'react';
import Calculator from '../components/Calculator';
import { useQuoteStore } from '../lib/store';

export default function CalculatorPage() {
    const reset = useQuoteStore((s) => s.reset);

    useEffect(() => {
        reset();
    }, []);

    return (
        <div className="pt-20">
            <Calculator />
        </div>
    );
}
