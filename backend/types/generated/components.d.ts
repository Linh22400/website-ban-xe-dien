import type { Schema, Struct } from '@strapi/strapi';

export interface OrderCustomerDetails extends Struct.ComponentSchema {
  collectionName: 'components_order_customer_details';
  info: {
    displayName: 'CustomerDetails';
  };
  attributes: {
    City: Schema.Attribute.String;
    DeliveryAddress: Schema.Attribute.Text & Schema.Attribute.Required;
    District: Schema.Attribute.String;
    Email: Schema.Attribute.Email & Schema.Attribute.Required;
    FullName: Schema.Attribute.String & Schema.Attribute.Required;
    IdCard: Schema.Attribute.String;
    Phone: Schema.Attribute.String & Schema.Attribute.Required;
    Ward: Schema.Attribute.String;
  };
}

export interface ProductInfoWarrantyPolicy extends Struct.ComponentSchema {
  collectionName: 'components_product_info_warranty_policies';
  info: {
    displayName: 'Warranty Policy';
  };
  attributes: {
    batteryWarranty: Schema.Attribute.String & Schema.Attribute.Required;
    conditions: Schema.Attribute.RichText & Schema.Attribute.Required;
    exclusions: Schema.Attribute.RichText & Schema.Attribute.Required;
    maintenance: Schema.Attribute.Text & Schema.Attribute.Required;
    motorWarranty: Schema.Attribute.String & Schema.Attribute.Required;
    process: Schema.Attribute.RichText & Schema.Attribute.Required;
    returnPolicy: Schema.Attribute.Text & Schema.Attribute.Required;
    warrantyPeriod: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductArticleGallery extends Struct.ComponentSchema {
  collectionName: 'components_product_article_galleries';
  info: {
    displayName: 'ArticleGallery';
  };
  attributes: {
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
  };
}

export interface ProductArticleImage extends Struct.ComponentSchema {
  collectionName: 'components_product_article_images';
  info: {
    displayName: 'ArticleImage';
  };
  attributes: {
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface ProductArticleSection extends Struct.ComponentSchema {
  collectionName: 'components_product_article_sections';
  info: {
    displayName: 'ArticleSection';
  };
  attributes: {
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductArticleText extends Struct.ComponentSchema {
  collectionName: 'components_product_article_texts';
  info: {
    displayName: 'ArticleText';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface ProductArticleTwoColumn extends Struct.ComponentSchema {
  collectionName: 'components_product_article_two_columns';
  info: {
    displayName: 'ArticleTwoColumn';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['left-image', 'right-image']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'left-image'>;
  };
}

export interface ProductColors extends Struct.ComponentSchema {
  collectionName: 'components_product_colors';
  info: {
    displayName: 'colors';
  };
  attributes: {
    hex: Schema.Attribute.String & Schema.Attribute.Required;
    images: Schema.Attribute.Media<'images', true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.Decimal;
    stock: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface ProductOptions extends Struct.ComponentSchema {
  collectionName: 'components_product_options';
  info: {
    description: 'Product configuration options like Battery, Version, etc.';
    displayName: 'options';
  };
  attributes: {
    group: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Battery'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    priceAdjustment: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    stock: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'order.customer-details': OrderCustomerDetails;
      'product-info.warranty-policy': ProductInfoWarrantyPolicy;
      'product.article-gallery': ProductArticleGallery;
      'product.article-image': ProductArticleImage;
      'product.article-section': ProductArticleSection;
      'product.article-text': ProductArticleText;
      'product.article-two-column': ProductArticleTwoColumn;
      'product.colors': ProductColors;
      'product.options': ProductOptions;
    }
  }
}
