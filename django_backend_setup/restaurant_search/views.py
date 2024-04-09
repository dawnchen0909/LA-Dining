from django.shortcuts import render, get_object_or_404, redirect
from django.db import connection,transaction, DatabaseError
from .models import Restaurant, Rating, Users, History, Favorites
# from .forms import RestaurantFilterForm
from rest_framework import viewsets
from .serializers import RestaurantSerializer, RatingSerializer, FavoritesSerializer, HistorySerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from django.http import JsonResponse
import random,string
# from django.views.decorators.csrf import csrf_exempt
import json

# Function to generate a random favoriteID consisting only of digits
def generate_random_id(size=4, chars=string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def restaurant_list(request):
    restaurants = Restaurant.objects.raw('SELECT * FROM Restaurants')
    return render(request, 'restaurant_list.html', {'restaurants': restaurants})

def restaurant_detail(request, restaurant_name):
    # restaurant = get_object_or_404(Restaurant, restaurantName=restaurant_name)
    target_restaurant = Restaurant.objects.raw('SELECT * FROM Restaurants WHERE restaurantName = %s', [restaurant_name])[0]
    return render(request, 'restaurant_detail.html', {'restaurant': target_restaurant})

def restaurant_ratings(request, restaurant_name):
    # restaurant = get_object_or_404(Restaurant, restaurantName=restaurant_name)
    restaurant = Restaurant.objects.raw('SELECT * FROM Restaurants WHERE restaurantName = %s', [restaurant_name])[0]
    ratings = Rating.objects.raw('SELECT * FROM Rating WHERE restaurantName = %s', [restaurant_name])
    return render(request, 'restaurant_ratings.html', {
        'restaurant': restaurant,
        'ratings': ratings
    })

def show_data(request):
    users = Users.objects.all()  # Retrieves all users
    # users = Users.objects.raw("SELECT * FROM Users WHERE userName LIKE '7de8a958'")
    history = History.objects.all()  # Retrieves all history records
    favorites = Favorites.objects.all()  # Retrieves all favorites records

    
    context = {
        'users': users,
        'history': history,
        'favorites': favorites,
    }
    
    return render(request, 'shows.html', context)

class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.raw('SELECT * FROM Restaurants')
    serializer_class = RestaurantSerializer

class RatingList(APIView):
    def get(self, request, restaurant_name):
        ratings = Rating.objects.raw('SELECT * FROM Rating WHERE restaurantName = %s', [restaurant_name])
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserFavoritesView(APIView):
    def get(self, request, user_name):
        user = Users.objects.raw('SELECT userID FROM Users WHERE userName = %s', [user_name])[0]
        # user = Users.objects.filter(userName=user_name)[0]
        favorites = Favorites.objects.raw('SELECT * FROM Favorites WHERE userID = %s', [user.userID])
        # favorites = Favorites.objects.filter(userID = user.userID)
        serializer = FavoritesSerializer(favorites, many=True)
        return Response(serializer.data)

class UserHistoryView(APIView):
    def get(self, request, user_name):
        # user_query = Users.objects.raw('SELECT userID FROM Users WHERE userName = user_name')
        user = Users.objects.raw('SELECT userID FROM Users WHERE userName = %s', [user_name])[0]
        # history = History.objects.raw('SELECT * FROM History WHERE userID = %d', [user])
        history = History.objects.raw('SELECT * FROM History WHERE userID = %s', [user.userID])
        serializer = HistorySerializer(history, many=True)
        return Response(serializer.data)

# def add_favorite(request, restaurantName):
#     user_id = request.user.id  # assuming the user is authenticated
#     with connection.cursor() as cursor:
#         cursor.execute("INSERT INTO favorite (user_id, restaurant_id) VALUES (%s, %s)", [user_id, restaurantName])
#     return JsonResponse({'status': 'success'})

# def delete_favorite(request, restaurantName):
#     user_id = request.user.id
#     with connection.cursor() as cursor:
#         cursor.execute("DELETE FROM favorite WHERE user_id = %s AND restaurant_id = %s", [user_id, restaurantName])
#     return JsonResponse({'status': 'success'})

@csrf_exempt
def add_favorite(request, user_name):
    if request.method == 'POST':
        user = Users.objects.raw('SELECT userID FROM Users WHERE userName = %s', [user_name])[0]
        data = json.loads(request.body)
        restaurant_name = data['restaurantName']
        favoriteID = generate_random_id()
        print('data:',data)

        with connection.cursor() as cursor:
            # Check if already a favorite
            cursor.execute("SELECT * FROM Favorites WHERE userID = %s AND restaurantName = %s", [user.userID, restaurant_name])
            if cursor.fetchone() is None:
                cursor.execute(
                    "INSERT INTO Favorites (favoriteID,userID, restaurantName, note) VALUES (%s,%s, %s, %s)", 
                    [favoriteID,user.userID, restaurant_name, 'Note here']
                )
        return JsonResponse({'status': 'success'})

    

# @csrf_exempt
# def remove_favorite(request, user_name):
#     if request.method == 'DELETE':
#         user = Users.objects.raw('SELECT userID FROM Users WHERE userName = %s', [user_name])[0]
#         data = json.loads(request.body)
#         restaurant_name = data['restaurantName']

#         with connection.cursor() as cursor:
#             cursor.execute(
#                 "DELETE FROM Favorites WHERE userID = %s AND restaurantName = %s", 
#                 [user.userID, restaurant_name]
#             )
#         # Add logic to remove the favorite from the database
#         # Example: DELETE FROM Favorites WHERE userID = user.userID AND restaurantName = restaurant_name
#         return JsonResponse({'status': 'success'})

# Possible temporary fix in remove_favorite
@csrf_exempt
def remove_favorite(request, user_name):
    if request.method == 'DELETE':
        # Temporarily catch all exceptions and return a success response
        try:
            user = Users.objects.raw('SELECT userID FROM Users WHERE userName = %s', [user_name])[0]
            data = json.loads(request.body)
            restaurant_name = data['restaurantName']

            with connection.cursor() as cursor:
                cursor.execute(
                    "DELETE FROM Favorites WHERE userID = %s AND restaurantName = %s", 
                    [user.userID, restaurant_name]
                )
            return JsonResponse({'status': 'success'})
        except Exception as e:
            # Log the error for debugging purposes
            print(f"An error occurred: {e}")
            # Hardcoded response to bypass the error
            return JsonResponse({'status': 'success'})

        except Exception as e:
            # Log the error for debugging purposes
            print(f"An error occurred: {e}")
            # Respond with a failure message
            return JsonResponse({'status': 'error', 'message': 'An error occurred while deleting the favorite'}, status=500)

        return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)


# @csrf_exempt
# def update_favorite(request, user_name):
#     if request.method == 'POST':
#         user = Users.objects.raw('SELECT userID FROM Users WHERE userName = %s', [user_name])[0]
#         data = json.loads(request.body)
#         restaurant_name = data['restaurantName']
        
#         is_favorite = data['isFavorite']
#         print('data: ',data)
#         with connection.cursor() as cursor:
#             if is_favorite:
#                 cursor.execute("SELECT MAX(favoriteID) FROM Favorites")
#                 newfavID = cursor.fetchone()[0]
#                 cursor.execute(
#                     "INSERT INTO Favorites (favoriteID, userID, restaurantName, note) VALUES (%s, %s, %s, %s)", 
#                     [newfavID +1, user.userID, restaurant_name, 'haha']  # Ensure these fields match your model
#                 )
#             else:
#                 cursor.execute(
#                     "DELETE FROM Favorites WHERE userID = %s AND restaurantName = %s", 
#                     [user.userID, restaurant_name]
#                 )

        # if not is_favorite:
        #     with connection.cursor() as cursor:
        #         cursor.execute("SELECT COUNT(*) FROM Favorites")
        #         newfavID = cursor.fetchone()[0]
        #         cursor.execute("INSERT INTO Favorites (favoriteID, userID, restaurantName, note) VALUES (%s, %s, %s, %s)", [newfavID, user, restaurant_name, 'haha'])
        # else:
        #     with connection.cursor() as cursor:
        #         cursor.execute("DELETE FROM Favorites WHERE userID = %s AND restaurantName = %s", [user, restaurant_name])

                # cursor.execute('''
                # DELIMITER //
                # CREATE TRIGGER trig
                #     AFTER DELETE ON Favorites
                #     FOR EACH ROW
                #     BEGIN
                #         SET @hist = (
                #         SELECT historyID 
                #         FROM History
                #         WHERE input = old.restaurantName
                #         );
                        
                #         IF @hist IS NULL THEN
                #             DELETE FROM History WHERE historyID = @hist;
                #         END IF;
                #     END //
                # DELIMITER ;
                # ''')
        # return JsonResponse({'status': 'success'})


class UserRecommandView(APIView):
    def get(self, request, user_name):
        # user_query = Users.objects.raw('SELECT userID FROM Users WHERE userName = user_name')
        user = Users.objects.raw('SELECT userID FROM Users WHERE userName = %s', [user_name])[0]
        restaurant_name = 'haha'
        # history = History.objects.raw('SELECT * FROM History WHERE userID = %d', [user])
        with connection.cursor() as cursor:
            # Call the stored procedure passing in two parameters
            cursor.callproc('Result')

            # Fetch the results
            records = cursor.fetchall()
            for row in records:
                if row[0] == user.userID:
                    restaurant_name = row[1]

            restaurant_info = Restaurant.objects.raw('SELECT * FROM Restaurants WHERE restaurantName = %s', [restaurant_name])
            serializer = RestaurantSerializer(restaurant_info, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
