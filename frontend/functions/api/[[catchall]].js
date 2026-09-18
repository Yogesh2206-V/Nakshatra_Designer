/**
 * Cloudflare Pages Function - Universal API Router for Nakshatra Designer's
 * Handles all /api/* requests on Cloudflare's Edge Network with zero-cold-start JSON responses.
 */

const defaultShopInfo = {
  name: "Nakshatra Designer's",
  tagline: "Bridal Blouse, Designer Frocks, Saree Conversion & Aari Studio",
  established: "Est. 2000 (25+ Years of Excellence)",
  address: "No 62/2, Everest Balaji Arcade, South Car Street (Opp. Sivakumar Metal Mart), Tiruchengode West, Tiruchengode - 637211",
  phones: ["+91 63852 65663", "+91 91235 00065"],
  whatsapp: "+916385265663",
  rating: "4.9 ⭐ (Justdial - 28+ Verified Reviews) | 5.0 ⭐ (Google)",
  hours: "Mon – Sat: 9:30 AM – 8:00 PM | Sun: 11:00 AM – 2:00 PM",
  instagram: "@nakshatra_designers_2101"
};

const defaultOptions = {
  garmentTypes: [
    { id: 'saree_blouse', name: 'Custom Saree Blouse', basePrice: 650, desc: 'Bridal Aari work, puff sleeves & designer saree blouses' },
    { id: 'designer_frock', name: 'Designer Frock / Long Dress', basePrice: 950, desc: 'Custom frocks, Anarkali gowns & kids/women dresses' },
    { id: 'saree_to_frock', name: 'Saree Converted Frock (Saree Reuse)', basePrice: 1200, desc: 'Repurpose old or silk sarees into grand designer frocks & maxi gowns' },
    { id: 'saree_pleating', name: 'Saree Pre-Pleating & Box Folding', basePrice: 350, desc: 'Professional saree pre-pleating for 1-minute wearing' },
    { id: 'skirt_shirt', name: 'Skirt Shirt & Ethnic Kids Wear', basePrice: 850, desc: 'Custom designer skirt and top / shirt tailoring for kids & women' },
    { id: 'salwar_kurti', name: 'Designer Salwar & Kurti Set', basePrice: 550, desc: 'Custom kurti, pant & dupatta tailoring' },
    { id: 'lehenga_set', name: 'Bridal / Festive Lehenga Choli', basePrice: 1400, desc: 'Heavy flare lehenga skirt & blouse tailoring' }
  ],
  frockFlares: [
    { id: 'umbrella_flare', name: 'Umbrella Circle Flare (360° Gown)', price: 300, desc: '360 degree grand circular flare' },
    { id: 'pleated_box', name: 'Box Pleated Royal Flare', price: 250, desc: 'Classic structured box pleats' },
    { id: 'tiered_layers', name: 'Multi-Layered Tiered Frock', price: 400, desc: 'Layered ruffle & gather style' },
    { id: 'straight_maxi', name: 'Straight Cut Elegant Maxi Frock', price: 150, desc: 'Sleek A-line silhouette' }
  ],
  frontNecks: [
    { id: 'sweetheart', name: 'Sweetheart Neck', price: 0, previewType: 'sweetheart' },
    { id: 'boat', name: 'Boat Neck', price: 100, previewType: 'boat' },
    { id: 'deep_u', name: 'Deep U Neck', price: 0, previewType: 'deep_u' },
    { id: 'high_collar', name: 'High Collar / Mandarin', price: 250, previewType: 'high_collar' },
    { id: 'potli_front', name: 'Front Placket with Potli Buttons', price: 200, previewType: 'potli_front' },
    { id: 'deep_v', name: 'Royal V Neck', price: 150, previewType: 'deep_v' }
  ],
  backNecks: [
    { id: 'deep_u_back', name: 'Deep U with Dori & Tassels', price: 150, previewType: 'deep_u_back' },
    { id: 'open_back', name: 'Square Open Back', price: 100, previewType: 'open_back' },
    { id: 'window_cutout', name: 'Diamond Cutout Window', price: 200, previewType: 'window_cutout' },
    { id: 'bow_back', name: 'Statement Ribbon Bow Back', price: 250, previewType: 'bow_back' },
    { id: 'potli_keyhole', name: 'Oval Keyhole with Potli Accent', price: 180, previewType: 'potli_keyhole' }
  ],
  sleeves: [
    { id: 'short', name: 'Classic Short Sleeve (5-6")', price: 0, length: 'short' },
    { id: 'elbow', name: 'Elbow Length (10-11")', price: 150, length: 'elbow' },
    { id: 'three_fourth', name: '3/4th Sleeve (14-15")', price: 200, length: 'three_fourth' },
    { id: 'full', name: 'Full Length Sleeve (20")', price: 250, length: 'full' },
    { id: 'puff', name: 'Traditional South Indian Puff Sleeve', price: 300, length: 'puff' },
    { id: 'sleeveless', name: 'Sleeveless', price: 0, length: 'sleeveless' },
    { id: 'cold_shoulder', name: 'Cold Shoulder Cut', price: 220, length: 'cold_shoulder' }
  ],
  fabrics: [
    { id: 'kanjivaram_silk', name: 'Pure Kanjivaram Silk / Saree Fabric', price: 800, color: '#9B1B30', texture: 'silk' },
    { id: 'raw_silk', name: 'Luxury Raw Silk', price: 600, color: '#4A0E17', texture: 'silk' },
    { id: 'royal_velvet', name: 'Royal Velvet', price: 750, color: '#2C1B4D', texture: 'velvet' },
    { id: 'brocade', name: 'Zari Weave Brocade', price: 700, color: '#D4AF37', texture: 'brocade' },
    { id: 'organza', name: 'Sheer Organza', price: 500, color: '#E8C5C8', texture: 'organza' },
    { id: 'cotton', name: 'Handloom Soft Cotton', price: 350, color: '#0F4C81', texture: 'cotton' }
  ],
  embroidery: [
    { id: 'none', name: 'Standard Tailoring (No Embroidery)', price: 0 },
    { id: 'neckline_aari', name: 'Neckline Delicate Aari Work', price: 800 },
    { id: 'heavy_bridal_aari', name: 'Heavy Bridal Maggam / Zardozi Work', price: 2500 },
    { id: 'sleeve_border_aari', name: 'Elbow Sleeve Motif & Border Aari', price: 1200 },
    { id: 'peacock_motif', name: 'Grand Peacock / Temple Motif (Back & Sleeves)', price: 3000 }
  ],
  addOns: [
    { id: 'padding', name: 'Premium Cup Padding', price: 200 },
    { id: 'double_lining', name: 'Cotton Double Lining', price: 150 },
    { id: 'designer_latkan', name: 'Handmade Velvet & Zari Latkans/Tassels', price: 300 },
    { id: 'piping', name: 'Contrast Satin Piping', price: 100 },
    { id: 'side_zipper', name: 'Concealed Side Zipper Closure', price: 120 },
    { id: 'can_can', name: 'Can-Can Stiff Net Layer (For Frocks)', price: 350 }
  ],
  baseStitchingPrice: 650
};

const jsonResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const method = request.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  // 1. Health check: /api/health
  if (path === '/api/health' || path === '/api') {
    return jsonResponse({
      status: 'online',
      service: "Nakshatra Designer's Boutique API (Cloudflare Edge)",
      time: new Date().toISOString()
    });
  }

  // 2. Options: /api/options
  if (path === '/api/options' && method === 'GET') {
    return jsonResponse({
      success: true,
      shopInfo: defaultShopInfo,
      options: defaultOptions
    });
  }

  // 3. Designs: /api/designs
  if (path === '/api/designs') {
    if (method === 'GET') {
      return jsonResponse({
        success: true,
        designs: []
      });
    }

    if (method === 'POST') {
      try {
        const body = await request.json();
        const newDesign = {
          id: 'design_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          title: body.title || 'Custom Design',
          category: body.category || 'Blouses',
          image: body.image || '',
          description: body.description || 'Masterfully tailored bespoke design.',
          garmentType: body.garmentType || 'saree_blouse',
          fabric: body.fabric || 'Pure Silk',
          embroidery: body.embroidery || 'Aari Work',
          badge: body.badge || 'New Arrival',
          price: body.price || 'Affordable Rate',
          createdAt: new Date().toISOString()
        };

        return jsonResponse({
          success: true,
          message: 'New design published successfully to Lookbook catalog!',
          design: newDesign
        }, 201);
      } catch (err) {
        return jsonResponse({ success: false, message: 'Invalid design payload' }, 400);
      }
    }
  }

  // Delete design: /api/designs/:id
  if (path.startsWith('/api/designs/') && method === 'DELETE') {
    const id = path.replace('/api/designs/', '');
    return jsonResponse({
      success: true,
      message: `Design ${id} removed successfully.`
    });
  }

  // 4. Orders: /api/orders
  if (path === '/api/orders' && method === 'POST') {
    try {
      const body = await request.json();
      const newOrder = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        ...body,
        status: 'Order Placed (Pending Verification)',
        orderDate: new Date().toISOString(),
        expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      return jsonResponse({
        success: true,
        message: 'Order received successfully!',
        order: newOrder
      }, 201);
    } catch (err) {
      return jsonResponse({ success: false, message: 'Invalid order data' }, 400);
    }
  }

  // 5. Pickups: /api/pickups
  if (path === '/api/pickups' && method === 'POST') {
    try {
      const body = await request.json();
      const newPickup = {
        id: 'PU-' + Math.floor(100 + Math.random() * 900),
        ...body,
        status: 'Scheduled'
      };

      return jsonResponse({
        success: true,
        message: 'Doorstep pickup scheduled successfully!',
        pickup: newPickup
      }, 201);
    } catch (err) {
      return jsonResponse({ success: false, message: 'Invalid pickup data' }, 400);
    }
  }

  // 6. Auth: /api/auth/login, /api/auth/signup
  if (path === '/api/auth/login' || path === '/api/auth/signup') {
    try {
      const body = await request.json();
      const identifier = (body.phoneOrEmail || body.phone || body.email || '').toString().trim().toLowerCase();
      const password = (body.password || '').toString();

      // Check admin
      const isAdminLogin = identifier === 'nakshatradesign' || identifier === '9123500065' || identifier === 'vishal22.06.2005@gmail.com';
      if (isAdminLogin) {
        if (password === 'nakshatra@2000' || password === 'admin123' || password === '9123500065') {
          return jsonResponse({
            success: true,
            message: '✨ Welcome to Nakshatra Admin Studio!',
            user: {
              id: 'admin_nakshatra',
              name: 'Nakshatradesign',
              phone: '9123500065',
              email: 'vishal22.06.2005@gmail.com',
              role: 'admin',
              isAdmin: true
            }
          });
        }
      }

      // Standard user
      return jsonResponse({
        success: true,
        message: path === '/api/auth/signup' ? 'Account created successfully!' : 'Login successful!',
        user: {
          id: 'user_' + Date.now(),
          name: body.name || 'Nakshatra Customer',
          phone: body.phoneOrEmail || body.phone || '',
          email: body.email || '',
          role: 'customer',
          isAdmin: false
        }
      });
    } catch (err) {
      return jsonResponse({ success: false, message: 'Authentication error' }, 400);
    }
  }

  // Avatar update: /api/auth/avatar
  if (path === '/api/auth/avatar' && method === 'PUT') {
    return jsonResponse({
      success: true,
      message: 'Avatar synchronized successfully.'
    });
  }

  return jsonResponse({ error: 'Endpoint not found', path }, 404);
}
