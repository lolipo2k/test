const parseIsoLocal = (isoString: string): Date => {
    const parts = isoString
        .split(/\D/)
        .map((value: string) => Number.parseInt(value));

    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], 0);
};

// return 08:45 from 2021-03-07T08:45:00
const getTime = (isoString: Date | string): string => {
    // Поскольку мы не передаем часовой пояс, время может быть интерпретировано в UTC и привестись к длкальному
    // часовому поясу. Чтобы этого избежать, нужно самостоятельно распарсить строку
    const date = typeof isoString !== 'string'
        ? isoString
        : parseIsoLocal(isoString);

    // Для времени  в 24-часовом всегда указываем русскую локаль, так как в англоязычной локали 00:хх отображается как 24:хх
    return date.toLocaleTimeString(['ru'], {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
};

// return 07.03.2021
export const getDateDayMonthYear = (isoString: Date | string): string => {
    return new Date(isoString).toLocaleDateString('ru', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    }).toString();
};

// return 15.06.2021, 10:00 from 2021-03-07T08:45:00
export const getFormattedDateTime = (date: Date | string | undefined): string => {
    let formattedDate = '';
    if (date) {
        formattedDate = `${getDateDayMonthYear(date)}, ${getTime(date)}`;
    }
    return formattedDate;
};