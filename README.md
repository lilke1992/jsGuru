<h1>
How to start a project
</h1>
<p>
  Make sure that you have docker installed and run it
  In order to run a docker image use : <br>
  <strong>
  docker compose up dev-db -d
  </strong>
  We are going to use prisma ORM with postgresql DB. 
  <strong>
    npx prisma init
  </strong>
</p>
<p>For more information please follow the link <a href='https://docs.nestjs.com/recipes/prisma'> </p>
<p>For more information about relations using prisma please follow the link <a href='https://www.prisma.io/docs/concepts/components/prisma-schema/data-model'></p>
<p>If you haven't created db tables yet, or you added new ones, please run:</p>
<p><strong>npx prisma migrate dev</strong></p>
<p>In order to see your db entities run</p>
<p><strong>npx prisma studio</strong> and you should be able to open it in browser to check entities</p>


## License

Nest is [MIT licensed](LICENSE).
