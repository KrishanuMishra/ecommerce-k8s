kubectl create secret generic mysql-secret \
 --from-literal=MYSQL_ROOT_PASSWORD=password \
 --from-literal=MYSQL_DATABASE=ecommerce_db \
 -n dev
