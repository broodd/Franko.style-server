import AccessControl from 'accesscontrol';
const ac = new AccessControl();

ac.grant('CLIENT');
// 	.readAll("book")
// 	.updateOwn("profile")
// 	.deleteOwn("profile")

ac.grant('MODERATOR').readAny('user');

ac.grant('ADMIN').extend('MODERATOR').updateAny('user').deleteAny('user');

export default ac;
