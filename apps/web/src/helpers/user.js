export const checkMiddleware = (checkingRoles = [], userRoles = []) => {
    const userRoleNames = userRoles.map(({ name }) => name);

    // if the user has the amdin role then they can access everything.
    // if(userRoleNames.includes('admin')){
    //     return true;
    // }

    // explicitly check roles
    return checkingRoles.some(r => userRoleNames.includes(r));
};
