const checkMiddleware = (checking = [], userRole = '', userAbilities = []) => {
    // const userRoleNames = userRoles.map(({ name }) => name);
    // @todo, this should be whatever the "superadmin" role will be
    checking.unshift('software_engineer'); // check if admin first.
    // explicitly check role and abilities
    return (
        checking.includes(userRole) ||
        checking.some((a) => userAbilities.includes(a))
    );
};

export default checkMiddleware;
