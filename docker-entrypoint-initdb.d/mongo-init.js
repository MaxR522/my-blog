print('====================================================');
print('================      INIT DB       ================');
print('====================================================');

db = db.getSiblingDB('myBlogDb');

db.createUser({
  user: 'blog',
  pwd: 'myblog123123',
  roles: [
    {
      role: 'readWrite',
      db: 'myBlogDb',
    },
  ],
});
