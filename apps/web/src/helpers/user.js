const checkMiddleware = (checking = [], userRoles = [], userAbilites = []) => {
    const userRoleNames = userRoles.map(({ name }) => name);
    // @todo, this should be whatever the "superadmin" role will be
    checking.unshift("admin"); // check if admin first.

    // explicitly check roles
    return (
        checking.some((r) => userRoleNames.includes(r)) ||
        checking.some((a) => userAbilites.includes(a))
    );
};

export default checkMiddleware;
