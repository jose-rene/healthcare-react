export const validate = (index, data) => {
    switch (index) {
        case 0:
            const { member } = data;
            if (
                !member.address ||
                !member.phone.number ||
                !member.payer ||
                !member.lob ||
                !member.member_number ||
                !member.id
            )
                return false;
            return true;
        case 1:
            return !!data.auth_number;
        case 2:
            return !!data.codes.length;
        case 3:
            return !!data.request_items.length;
        case 4:
            return !!data.due_at;
    }
};
