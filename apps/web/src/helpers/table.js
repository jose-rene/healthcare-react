

export const mapTypeToClass = (columnType) => {
    switch(columnType){
        case Number:
            return 'text-right';
        case String:
        default:
            return 'text-left';
    }
}
