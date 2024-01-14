import date from "date-and-time";
export const createCoupon = {
  headers: [
    { label: "couponCode", key: "couponCode" },
    { label: "applyFor", key: "applyFor" },
    { label: "discountType", key: "discountType" },
    { label: "discount", key: "discount" },
    { label: "description", key: "description" },
    { label: "minimumAmount", key: "minimumAmount" },
    { label: "numberOfUsesTimes", key: "numberOfUsesTimes" },
    { label: "categories", key: "categories" },
    { label: "subCategories", key: "subCategories" },
    { label: "startDate", key: "startDate" },
    { label: "expiryDate", key: "expiryDate" },
  ],
  data: [
    {
      couponCode: "WELCOMETEST",
      applyFor: "NEW_USER",
      discountType: "AMOUNT",
      discount: 20,
      description: "",
      minimumAmount: 1000,
      numberOfUsesTimes: 1,
      categories: "catid1,catid2",
      subCategories: "sub_catid1,sub_catid2",
      startDate: date.format(new Date(), "DD-MM-YYYY"),
      expiryDate: date.format(new Date(), "DD-MM-YYYY"),
    },
  ],
};

export const updateCoupon = {
  headers: [
    { label: "id", key: "id" },
    { label: "couponCode", key: "couponCode" },
    { label: "applyFor", key: "applyFor" },
    { label: "discountType", key: "discountType" },
    { label: "discount", key: "discount" },
    { label: "description", key: "description" },
    { label: "minimumAmount", key: "minimumAmount" },
    { label: "numberOfUsesTimes", key: "numberOfUsesTimes" },
    { label: "categories", key: "categories" },
    { label: "subCategories", key: "subCategories" },
    { label: "startDate", key: "startDate" },
    { label: "expiryDate", key: "expiryDate" },
    { label: "image", key: "image" },
    { label: "status", key: "status" },
  ],
};

export const pincode = {
  headers: [
    { label: "pincode", key: "pincode" },
    { label: "state", key: "state" },
    { label: "city", key: "city" },
  ],
  dummyData: [
    {
      pincode: "999999",
      state: "BANGAL",
      city: "KOLKATA",
    },
  ],
};

export const newsletter = {
  headers: [{ label: "email", key: "email" }],
  dummyData: [
    {
      email: "codescroller@gmail.com",
    },
  ],
};

export const inquires = {
  headers: [
    { label: "name", key: "name" },
    { label: "mobile", key: "mobile" },
    { label: "email", key: "email" },
    { label: "message", key: "message" },
    { label: "message", key: "message" },
  ],
  dummyData: [
    {
      name: "Bikash Kumar Singh",
      mobile: "9117162463",
      email: "codescroller@gmail.com",
      message: "Enter your message",
    },
  ],
};

export const updateInquiry = {
  headers: [
    { label: "id", key: "id" },
    { label: "name", key: "name" },
    { label: "mobile", key: "mobile" },
    { label: "email", key: "email" },
    { label: "message", key: "message" },
    { label: "status", key: "status" },
    { label: "inquiryStatus", key: "inquiryStatus" },
  ],
};

export const area = {
  headers: [
    { label: "name", key: "name" },
    { label: "pincode", key: "pincode" },
  ],

  dummyData: [
    {
      name: "AB Colony",
      pincode: "6437f7d3edeb4348da530be0",
    },
  ],
};

export const occasion = {
  headers: [
    { label: "name", key: "name" },
    { label: "slug", key: "slug" },
    { label: "shortDescription", key: "shortDescription" },
    { label: "seoTitle", key: "seoTitle" },
    { label: "seoDescription", key: "seoDescription" },
  ],

  dummyData: [
    {
      name: "Ganesh Puja",
      slug: "ganesh-puja",
      shortDescription: "This is a short description.",
      seoTitle: "Write SEO Title",
      seoDescription: "Write SEO Description",
    },
  ],
};
export const createColor = {
  headers: [
    { label: "name", key: "name" },
    { label: "slug", key: "slug" },
    { label: "shortDescription", key: "shortDescription" },
    { label: "seoTitle", key: "seoTitle" },
    { label: "seoDescription", key: "seoDescription" },
  ],

  dummyData: [
    {
      name: "Red",
      slug: "red",
      shortDescription: "This is a short description.",
      seoTitle: "Write SEO Title",
      seoDescription: "Write SEO Description",
    },
  ],
};

export const updateColor = {
  headers: [
    { label: "id", key: "id" },
    { label: "name", key: "name" },
    { label: "slug", key: "slug" },
    { label: "shortDescription", key: "shortDescription" },
    { label: "seoTitle", key: "seoTitle" },
    { label: "seoDescription", key: "seoDescription" },
    { label: "status", key: "status" },
  ],
};

export const category = {
  headers: [
    { label: "name", key: "name" },
    { label: "slug", key: "slug" },
    { label: "shortDescription", key: "shortDescription" },
    { label: "seoTitle", key: "seoTitle" },
    { label: "seoDescription", key: "seoDescription" },
  ],

  dummyData: [
    {
      name: "New Roses",
      slug: "new-roses",
      shortDescription: "This is a short description.",
      seoTitle: "Write SEO Title",
      seoDescription: "Write SEO Description",
    },
  ],
};

export const testimonial = {
  headers: [
    { label: "name", key: "name" },
    { label: "designation", key: "designation" },
    { label: "comment", key: "comment" },
    { label: "image", key: "image" },
  ],

  dummyData: [
    {
      name: "Bikash Singh",
      designation: "Student",
      comment: "Write user comment",
      image: "Image Url",
    },
  ],
};

export const subCategory = {
  headers: [
    { label: "name", key: "name" },
    { label: "slug", key: "slug" },
    { label: "category", key: "category" },
    { label: "shortDescription", key: "shortDescription" },
    { label: "seoTitle", key: "seoTitle" },
    { label: "seoDescription", key: "seoDescription" },
  ],

  dummyData: [
    {
      name: "New Roses",
      slug: "new-roses",
      category: "65081e49141c0741f8565163",
      shortDescription: "This is a short description.",
      seoTitle: "Write SEO Title",
      seoDescription: "Write SEO Description",
    },
  ],
};

export const createSize = {
  headers: [
    { label: "name", key: "name" },
    { label: "slug", key: "slug" },
    { label: "category", key: "category" },
    { label: "shortDescription", key: "shortDescription" },
    { label: "seoTitle", key: "seoTitle" },
    { label: "seoDescription", key: "seoDescription" },
  ],

  dummyData: [
    {
      name: "X-Seater",
      slug: "x-seater",
      category: "65081e49141c0741f8565163",
      shortDescription: "This is a short description.",
      seoTitle: "Write SEO Title",
      seoDescription: "Write SEO Description",
    },
  ],
};

export const updateSize = {
  headers: [
    { label: "id", key: "id" },
    { label: "name", key: "name" },
    { label: "slug", key: "slug" },
    { label: "category", key: "category" },
    { label: "shortDescription", key: "shortDescription" },
    { label: "seoTitle", key: "seoTitle" },
    { label: "seoDescription", key: "seoDescription" },
    { label: "status", key: "status" },
  ],
};

export const product = {
  headers: [
    { label: "name", key: "name" },
    { label: "slug", key: "slug" },
    { label: "mrp", key: "mrp" },
    { label: "sellingPrice", key: "sellingPrice" },
    { label: "sku", key: "sku" },
    { label: "maximumOrderQuantity", key: "maximumOrderQuantity" },
    { label: "defaultImage", key: "defaultImage" },
    { label: "images", key: "images" },
    { label: "shortDescription", key: "shortDescription" },
    { label: "description", key: "description" },
    { label: "category", key: "category" },
    { label: "occasion", key: "occasion" },
    { label: "tagLine", key: "tagLine" },
    { label: "seoTitle", key: "seoTitle" },
    { label: "seoDescription", key: "seoDescription" },
    { label: "seoTags", key: "seoTags" },
  ],

  dummyData: [
    {
      name: "Red Rose Flower",
      slug: "red-rose-flower",
      mrp: "50",
      sellingPrice: "40",
      sku: "PRDRSE001",
      maximumOrderQuantity: "20",
      defaultImage: "https://imgcdn.floweraura.com/DSC_7697_4.jpg",
      images: "",
      shortDescription: "This is a short description.",
      description: "This is description.",
      category: "642e9355106dadeb6a9555aa",
      occasion: "642ebb45c1850165aa750309",
      tagLine: "BESTSELLER/HOT/SALE",
      seoTitle: "Write SEO Title",
      seoDescription: "Write SEO Description",
      seoTags: "rose,red rose",
    },
  ],
};

export const bucket = {
  headers: [
    { label: "name", key: "name" },
    { label: "slug", key: "slug" },
    { label: "mrp", key: "mrp" },
    { label: "sellingPrice", key: "sellingPrice" },
    { label: "validity", key: "validity" },
    { label: "image", key: "image" },
    { label: "shortDescription", key: "shortDescription" },
    { label: "description", key: "description" },
    { label: "category", key: "category" },
    { label: "occasion", key: "occasion" },
    { label: "seoTitle", key: "seoTitle" },
    { label: "seoDescription", key: "seoDescription" },
    { label: "seoTags", key: "seoTags" },
  ],

  dummyData: [
    {
      name: "Golden Bucket",
      slug: "golden-bucket",
      mrp: "1000",
      sellingPrice: "900",
      validity: "30",
      image: "https://imgcdn.floweraura.com/DSC_7697_4.jpg",
      shortDescription: "This is a short description.",
      description: "This is description.",
      category: "642e9355106dadeb6a9555aa",
      occasion: "642ebb45c1850165aa750309",
      seoTitle: "Write SEO Title",
      seoDescription: "Write SEO Description",
      seoTags: "rose,red rose",
    },
  ],
};
