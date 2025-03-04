cd backend
mvn clean package
cd ..
docker-compose -p webapp4 up --build
