Database name: deutschbookdb
DBMS: PostgreSQL

1) Create database:
   createdb -U postgres deutschbookdb

2) Optional manual schema import:
   psql -U postgres -d deutschbookdb -f schema.sql
   psql -U postgres -d deutschbookdb -f seed.sql

3) If you need the exact custom dump after running the app:
   pg_dump -U postgres -h localhost -p 5432 -d deutschbookdb -F c -f deutschbookdb_backup.dump

Note: Spring Boot can also create/update tables automatically with spring.jpa.hibernate.ddl-auto=update.
