import AccessControl from 'accesscontrol';
const ac = new AccessControl();

ac.grant('CLIENT');
// 	.readAll("book")
// 	.updateOwn("profile")
// 	.deleteOwn("profile")

ac.grant('MODERATOR')
  .readAny('user')
  .createAny('product')
  .updateAny('product')
  .deleteAny('product');

ac.grant('ADMIN').extend('MODERATOR').updateAny('user').deleteAny('user').deleteAny('product');

export default ac;
