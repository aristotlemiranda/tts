import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';

// Define the type for product items
interface Product {
  title: string;
  price: number;
  rating: number;
  sku: string;
}

const ProductsList: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = React.useCallback(async () => {
    if (loading) {return;}
    setLoading(true);
    try {
      const response = await fetch(`https://dummyjson.com/products?limit=20&skip=${page * 20}&select=title,price,rating,sku`);
      const result = await response.json();
      setData(prevData => [...prevData, ...result.products]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [loading, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderItem = ({ item }: { item: Product }) => (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1 / 3, margin: 1, padding: 10, backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd' }}>
      <Text>{item.title}</Text>
      <Text>Price: ${item.price}</Text>
      <Text>Rating: {item.rating}</Text>
      <Text>SKU: {item.sku}</Text>
    </View>
  );

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.sku.toString()}
        numColumns={3}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
      />
    </View>
  );
};

export default ProductsList;
