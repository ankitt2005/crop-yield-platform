def calculate_soil_factor(ph: float, soil_type: str) -> float:
    factor = 1.0
    if 6.5 <= ph <= 7.5:
        factor *= 1.1
    elif ph < 5.5 or ph > 8.5:
        factor *= 0.85

    if soil_type in ["Alluvial", "Black", "Loamy"]:
        factor *= 1.05
    return factor

def calculate_weather_factor(rainfall: float, temperature: float, humidity: float) -> float:
    factor = 1.0
    if 600 <= rainfall <= 1000:
        factor *= 1.1
    elif rainfall < 400 or rainfall > 1500:
        factor *= 0.85

    if 20 <= temperature <= 30:
        factor *= 1.05
    elif temperature < 10 or temperature > 40:
        factor *= 0.9

    if 50 <= humidity <= 70:
        factor *= 1.05

    return factor

def apply_dynamic_fusion(base_crop: float, soil_factor: float, weather_factor: float) -> float:
    """
    Implements the patent claim: "Weighting or prioritization logic when multiple parameters conflict."
    """
    # Patent Logic: If soil is optimal but weather is highly adverse, weather heavily penalizes the crop.
    if soil_factor > 1.0 and weather_factor < 0.9:
        # Weather factor dominates (60% weight to weather, 40% to soil)
        fusion_multiplier = (weather_factor * 0.6) + (soil_factor * 0.4)
    # Patent Logic: If weather is optimal but soil is adverse, soil heavily penalizes the crop.
    elif weather_factor > 1.0 and soil_factor < 0.9:
        # Soil factor dominates (60% weight to soil, 40% to weather)
        fusion_multiplier = (soil_factor * 0.6) + (weather_factor * 0.4)
    else:
        # Normal synergistic fusion
        fusion_multiplier = soil_factor * weather_factor
        
    return base_crop * fusion_multiplier
