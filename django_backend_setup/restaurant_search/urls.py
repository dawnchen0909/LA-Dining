from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet, RatingList, UserFavoritesView, UserHistoryView, UserRecommandView

router = DefaultRouter()
router.register(r'Restaurant', RestaurantViewSet)

urlpatterns = [
    # Add other URLs as needed
    path('restaurants/', views.restaurant_list, name='restaurant_list'),
    # path('', include('django.contrib.auth.urls')),
    path('restaurants/<str:restaurant_name>/', views.restaurant_detail, name='restaurant_detail'),
    path('restaurant/<str:restaurant_name>/ratings/', views.restaurant_ratings, name='restaurant_ratings'),
    path('api/', include(router.urls)),
    path('shows/', views.show_data, name='show_data'),
    path('api/ratings/<str:restaurant_name>/', RatingList.as_view(), name='rating-list'),
    path('api/user/favorites/<str:user_name>/', UserFavoritesView.as_view(), name='user-favorites'),
    path('api/user/history/<str:user_name>/', UserHistoryView.as_view(), name='user-history'),
    path('api/add/<str:user_name>/', views.add_favorite, name='add-favorite'),
    path('api/delete/<str:user_name>/', views.remove_favorite, name='remove-favorite'),
    path('api/recommand/<str:user_name>/', UserRecommandView.as_view(), name='update-recommand'),
]