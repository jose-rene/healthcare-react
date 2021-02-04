export const checkMiddleware = (checkingRoles = [], userRoles = []) => {
    const userRoleNames = userRoles.map(({ name }) => name);
    checkingRoles.unshift('admin'); // check if admin first.

    // explicitly check roles
    return checkingRoles.some(r => userRoleNames.includes(r));
};
