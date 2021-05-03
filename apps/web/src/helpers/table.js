export const ACTIONS = 'actions';

export const mapTypeToClass = (columnType) => {
    switch (columnType) {
        case ACTIONS:
            return 'text-center';
        case Number:
            return 'text-right';
        case String:
        default:
            return 'text-left';
    }
}
