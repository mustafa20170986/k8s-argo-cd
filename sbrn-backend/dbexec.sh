#!/bin/bash
# Fixed kubectl command
kubectl exec -it postgrescn-1 -c postgres -- psql -U postgres -d appdb -c "ALTER USER postgres WITH PASSWORD 'suborna';"