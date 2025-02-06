import fb_4073873 from "/public/fallback/4073873.png";
import fb_5811994 from "/public/fallback/5811994.png";
import fb_6073502 from "/public/fallback/6073502.png";
import fb_6078473 from "/public/fallback/6078473.png";
import fb_6081515 from "/public/fallback/6081515.png";
import fb_6116760 from "/public/fallback/6116760.png";
import fb_6141852 from "/public/fallback/6141852.png";
import fb_7718312 from "/public/fallback/7718312.png";
import fb_7728546 from "/public/fallback/7728546.png";
import fb_7738583 from "/public/fallback/7738583.png";
import fb_7769801 from "/public/fallback/7769801.png";
import fb_7896697 from "/public/fallback/7896697.png";

const fallbacks = {
  "4073873": fb_4073873,
  "5811994": fb_5811994,
  "6073502": fb_6073502,
  "6078473": fb_6078473,
  "6081515": fb_6081515,
  "6116760": fb_6116760,
  "6141852": fb_6141852,
  "7718312": fb_7718312,
  "7728546": fb_7728546,
  "7738583": fb_7738583,
  "7769801": fb_7769801,
  "7896697": fb_7896697,
}


export async function getImageURL (pixabayId) {
  const fetchWithTimeout = (url, ms = 5000) =>
    Promise.race([
      fetch(url),
      new Promise((_, reject) => 
       setTimeout(() => reject(new Error("Timeout")), ms)
      )
    ]);
  
  const cachedURL = localStorage.getItem(`image_${pixabayId}`);
  if (cachedURL) { // Check if URL exist in localStorage
    console.log("Url has been found in localStorage");
    
    try { // Check if found URL still valid
      const response = await fetch(cachedURL, { method: 'HEAD' }); 
      if (response.ok) {
        return cachedURL; // Return URL if valid
      } else { // Remove from localStorage if not valid
        localStorage.removeItem(`image_${pixabayId}`);
      }
    } catch (error) {
      console.error("Error checking cached URL:", error);
      localStorage.removeItem(`image_${pixabayId}`);
    }
  }
  
  console.log("Addressing API")
  try{ // Get new URL from API
    const response = await fetchWithTimeout(`https://.com/api/?key=48616540-5f0061190e7a3d1e4eb74b784&id=${pixabayId}&image_type=illustration&orientation=vertical`)
    
    if(!response.ok) {
      throw new Error("API response not OK")
    }

    const data = await response.json()
    const imageURL = data.hits[0].webformatURL
    localStorage.setItem(`image_${pixabayId}`, imageURL); // Save URL in localStorage for further usage
    console.log("URL has been saved in localStorage")

    return imageURL

    } catch (error) {
    console.error("Error:", error)
    console.log("Getting fallback")
    return fallbacks[pixabayId] || null;
  }
}