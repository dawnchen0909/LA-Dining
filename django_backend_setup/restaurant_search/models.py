from django.db import models

class Restaurant(models.Model):
    restaurantName = models.CharField(max_length=255, primary_key=True)
    style = models.CharField(max_length=255, null=False)
    price = models.CharField(max_length=255, null=False)
    address = models.CharField(max_length=255, null=False)
    zip = models.CharField(max_length=255, null=False)
    class Meta:
        db_table = 'Restaurants'

class Rating(models.Model):
    ratingID = models.AutoField(primary_key=True)
    restaurantName = models.ForeignKey(Restaurant, on_delete=models.CASCADE, db_column='restaurantName')
    score = models.IntegerField()
    comment = models.TextField()
    class Meta:
        db_table = 'Rating'

class Users(models.Model):
    userID = models.AutoField(primary_key=True)
    userName = models.CharField(max_length=255, null=False)
    password = models.CharField(max_length=255, null=False)
    class Meta:
        db_table = 'Users'

class History(models.Model):
    historyID = models.AutoField(primary_key=True)
    userID = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='userID')
    input = models.CharField(max_length=255, null=False)
    class Meta:
        db_table = 'History'

class Favorites(models.Model):
    favoriteID = models.AutoField(primary_key=True)
    userID = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='userID')
    restaurantName = models.CharField(max_length=255, null=False)
    note = models.CharField(max_length=255, null=False)
    class Meta:
        db_table = 'Favorites'
    

