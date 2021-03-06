/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    // const port = 8000 // Change this to your server port
    // return `http://localhost:${port}/data/restaurants.json`;

    return `http://${window.location.hostname}:1337/`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    fetch(DBHelper.DATABASE_URL + "restaurants").then(function (response) {
      return response.json();
    }).then(function (response) {
      callback(null, response);
    })
      .catch(e => {
        callback(e, null);
      });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    fetch(DBHelper.DATABASE_URL + 'restaurants/' + id).then(function (response) {
      return response.json();
    }).then(function (responseRestaurants) {
      fetch(DBHelper.DATABASE_URL + 'reviews/?restaurant_id=' + id).then(function (response) {
        return response.json();
      }).then(function (responseReviews) {
        responseRestaurants.reviews = responseReviews;
        callback(null, responseRestaurants);
      })
        .catch(e => {
          callback(e, null);
        });
    })
      .catch(e => {
        callback(e, null);
      });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);

        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}`);
  }

  static imageUrl(img) {
    return (`/img/${img}`);
  }

  /**
   * Restaurant image filename.
   */
  static imageFilename(restaurant) {
    return restaurant.photograph;
  }

  /**
   * Generate responsive image name.
   */
  static responsiveImageName(imgName, width) {
    return this.imageUrl(imgName + "_" + width + ".webp");
  }

  /**
   * Generate sourceset.
   */
  static generateSrcSet(restaurant) {
    let img = this.imageFilename(restaurant);
    let img1x, img2x, img25x;
    [img1x, img2x, img25x] = [this.responsiveImageName(img, "1x"),
    this.responsiveImageName(img, "2x"),
    this.responsiveImageName(img, "2.5x")
    ];
    let srcset = `${img1x} 1x, ${img2x} 2x, ${img25x} 2.5x`;
    return srcset;
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {
        title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      })
    marker.addTo(newMap);
    return marker;
  }

  static updateFavorite(id, check) {
    if (!navigator.onLine) {
      check.checked = !(check.checked);
      return;
    }
    fetch(`http://${window.location.hostname}:1337/restaurants/${id}/?is_favorite=${check.checked}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain'
      }})
      .then(res => res.json())
      .then(res => {
        // -
      });
  }

  static launch_toast(message, color) {
    let colors = {
      "red": "linear-gradient(to right, #F00000, #DC281E)",
      "green": "linear-gradient(to right, #56ab2f, #a8e063)",
      "orange": "linear-gradient(to right, #f12711, #f5af19)"
    };

    Toastify({
      text: message,
      duration: 5000,
      backgroundColor: colors[color],
    }).showToast();
}
}