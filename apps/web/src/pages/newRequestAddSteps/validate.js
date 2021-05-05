export const validate = (index, data) => {
    switch (index) {
        case 0:
            const { member } = data;
            console.log("+++++++", member);
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
            if (!data.auth_number) return false;
            return true;
        case 2:
            if (!data.codes.length) return false;
            return true;
        case 3:
            if (!data.request_items.length) return false;
            return true;
        case 4:
            if (!data.due_at) return false;
            return true;
    }
};
