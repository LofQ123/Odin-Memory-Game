export async function getImageURL (pixabayId) {
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
    const response = await fetch(`https://pixabay.com/api/?key=48616540-5f0061190e7a3d1e4eb74b784&id=${pixabayId}&image_type=illustration&orientation=vertical`)
    
    if(!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json()
    const imageURL = data.hits[0].webformatURL
   
    localStorage.setItem(`image_${pixabayId}`, imageURL); // Save URL in localStorage for further usage
    console.log("URL has been saved in localStorage")

    return imageURL

    } catch (error) {
    console.error("Error:", error)
    return null;
  }
}