/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'moment-jalaali' {
    function momentJalaali(inp?: any, format?: string): momentJalaali.Moment;

    namespace momentJalaali {
        interface Moment {
            format(format?: string): string;
            isValid(): boolean;
            clone(): Moment;
            valueOf(): number;
            toDate(): Date;
            hours(): number;
            minutes(): number;
            seconds(): number;
            set(props: Record<string, number>): Moment;
            add(amount: number, unit: string): Moment;
            subtract(amount: number, unit: string): Moment;
            startOf(unit: string): Moment;
            endOf(unit: string): Moment;
            isBefore(m: Moment): boolean;
            isAfter(m: Moment): boolean;
            isSame(m: Moment): boolean;
            day(): number;
            year(): number;
            month(): number;
            date(): number;
            fromNow(): string;
            jYear(): number;
            jMonth(): number;
            jDate(): number;
        }

        function loadPersian(config?: { dialect?: string; usePersianDigits?: boolean }): void;
        function isMoment(obj: any): obj is Moment;
    }

    export = momentJalaali;
}
