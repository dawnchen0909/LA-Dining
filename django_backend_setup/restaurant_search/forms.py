from django import forms
from .models import Restaurant

class RestaurantFilterForm(forms.Form):
    price_choices = [(price, price) for price in Restaurant.objects.values_list('price', flat=True).distinct()]
    zip_choices = [(zip, zip) for zip in Restaurant.objects.values_list('zip', flat=True).distinct()]
    style_choices = [(style, style) for style in Restaurant.objects.values_list('style', flat=True).distinct()]

    price = forms.ChoiceField(choices=[('', 'Any')] + price_choices, required=False)
    zip = forms.ChoiceField(choices=[('', 'Any')] + zip_choices, required=False)
    style = forms.ChoiceField(choices=[('', 'Any')] + style_choices, required=False)


