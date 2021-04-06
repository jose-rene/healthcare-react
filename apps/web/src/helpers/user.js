const checkMiddleware = (checking = [], userRole = "", userAbilites = []) => {
    // const userRoleNames = userRoles.map(({ name }) => name);
    // @todo, this should be whatever the "superadmin" role will be
    // checking.unshift("admin"); // check if admin first.
    // explicitly check role and abilities
    return (
        checking.includes(userRole) ||
        checking.some((a) => userAbilites.includes(a))
    );
};

export default checkMiddleware;
