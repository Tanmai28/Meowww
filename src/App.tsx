import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { RefreshCw, Type, Tag, Cat, Image, Film, Sparkles, Trash2, Download } from 'lucide-react';

interface CatItem {
  id: string;
  url: string;
  text?: string;
  tag?: string;
  isGif?: boolean;
  catId?: string;
}

interface ApiCat {
  _id: string;
  tags: string[];
  url?: string;
}

export default function App() {
  const [cats, setCats] = useState<CatItem[]>([]);
  const [gifs, setGifs] = useState<CatItem[]>([]);
  const [apiTags, setApiTags] = useState<string[]>([]);
  const [catCount, setCatCount] = useState<number>(0);
  const [allCats, setAllCats] = useState<ApiCat[]>([]);
  const [loading, setLoading] = useState(true);
  const [customText, setCustomText] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [comboTag, setComboTag] = useState('');
  const [comboText, setComboText] = useState('');

  // Fetch all API data on mount
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        // Fetch tags from API
        const tagsResponse = await fetch('https://cataas.com/api/tags');
        const tagsData = await tagsResponse.json();
        // Filter out empty tags
        const validTags = tagsData.filter((tag: string) => tag && tag.trim() !== '');
        setApiTags(validTags);

        // Fetch cat count from API
        const countResponse = await fetch('https://cataas.com/api/count');
        const countData = await countResponse.json();
        setCatCount(countData.count);

        // Fetch all cats from API (limited to first 20)
        const catsResponse = await fetch('https://cataas.com/api/cats?limit=20');
        const catsData = await catsResponse.json();
        setAllCats(catsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching API data:', error);
        setLoading(false);
      }
    };

    fetchApiData();
  }, []);

  const addRandomCat = (isGif: boolean = false) => {
    const gifPart = isGif ? '/gif' : '';
    const newCat: CatItem = {
      id: Date.now().toString(),
      url: `https://cataas.com/cat${gifPart}?random=${Date.now()}`,
      isGif,
    };
    if (isGif) {
      setGifs([newCat, ...gifs]);
    } else {
      setCats([newCat, ...cats]);
    }
  };

  const addCatWithText = (isGif: boolean = false) => {
    if (!customText.trim()) return;
    const gifPart = isGif ? '/gif' : '';
    const newCat: CatItem = {
      id: Date.now().toString(),
      url: `https://cataas.com/cat${gifPart}/says/${encodeURIComponent(customText)}?random=${Date.now()}`,
      text: customText,
      isGif,
    };
    if (isGif) {
      setGifs([newCat, ...gifs]);
    } else {
      setCats([newCat, ...cats]);
    }
    setCustomText('');
  };

  const addCatWithTag = (tag: string, isGif: boolean = false) => {
    if (!tag) return;
    const gifPart = isGif ? '/gif' : '';
    const newCat: CatItem = {
      id: Date.now().toString(),
      url: `https://cataas.com/cat/${tag}${gifPart}?random=${Date.now()}`,
      tag,
      isGif,
    };
    if (isGif) {
      setGifs([newCat, ...gifs]);
    } else {
      setCats([newCat, ...cats]);
    }
  };

  const addCatWithTagAndText = (isGif: boolean = false) => {
    if (!comboTag || !comboText.trim()) return;
    const gifPart = isGif ? '/gif' : '';
    const newCat: CatItem = {
      id: Date.now().toString(),
      url: `https://cataas.com/cat/${comboTag}${gifPart}/says/${encodeURIComponent(comboText)}?random=${Date.now()}`,
      tag: comboTag,
      text: comboText,
      isGif,
    };
    if (isGif) {
      setGifs([newCat, ...gifs]);
    } else {
      setCats([newCat, ...cats]);
    }
    setComboText('');
  };

  const addCatById = (catId: string) => {
    const newCat: CatItem = {
      id: Date.now().toString(),
      url: `https://cataas.com/cat/${catId}`,
      catId,
    };
    setCats([newCat, ...cats]);
  };

  const refreshItem = (id: string, isGif: boolean) => {
    const items = isGif ? gifs : cats;
    const setItems = isGif ? setGifs : setCats;

    const updatedItems = items.map(item => {
      if (item.id === id) {
        const gifPart = item.isGif ? '/gif' : '';
        let url = 'https://cataas.com/cat';
        
        if (item.catId) {
          url = `https://cataas.com/cat/${item.catId}?random=${Date.now()}`;
        } else {
          if (item.tag) url += `/${item.tag}`;
          url += gifPart;
          if (item.text) url += `/says/${encodeURIComponent(item.text)}`;
          url += `?random=${Date.now()}`;
        }
        
        return { ...item, url };
      }
      return item;
    });

    setItems(updatedItems);
  };

  const clearAll = (isGif: boolean) => {
    if (isGif) {
      setGifs([]);
    } else {
      setCats([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cat data from API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-violet-600 mb-2"><Cat className="inline-block mr-2 text-violet-600" size={48} />Pawsitively Purrfect: Your Ultimate Cat API Playground</h1>
          <p className="text-gray-600">All cataas.com APIs Implemented</p>
        </div>

        {/* API Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-100 rounded-lg">
                  <Cat className="size-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-gray-600">Total Cats in DB</p>
                  <p className="text-violet-600">{catCount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-fuchsia-100 rounded-lg">
                  <Tag className="size-6 text-fuchsia-600" />
                </div>
                <div>
                  <p className="text-gray-600">Available Tags</p>
                  <p className="text-fuchsia-600">{apiTags.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Image className="size-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-gray-600">API Status</p>
                  <p className="text-pink-600">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="images" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="images">Images ({cats.length})</TabsTrigger>
            <TabsTrigger value="gifs">GIFs ({gifs.length})</TabsTrigger>
            <TabsTrigger value="browse">Browse DB</TabsTrigger>
          </TabsList>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Random Image */}
                <div>
                  <label className="text-gray-700 mb-2 block">Random Cat Image</label>
                  <Button onClick={() => addRandomCat(false)} className="w-full">
                    <RefreshCw className="mr-2 size-4" />
                    Get Random Cat Image
                  </Button>
                </div>

                {/* Image with Text */}
                <div>
                  <label className="text-gray-700 mb-2 block">Cat Image with Text</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter text..."
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCatWithText(false)}
                    />
                    <Button onClick={() => addCatWithText(false)} variant="outline">
                      <Type className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Image by Tag */}
                <div>
                  <label className="text-gray-700 mb-2 block">Cat Image by Tag</label>
                  <div className="flex gap-2">
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a tag..." />
                      </SelectTrigger>
                      <SelectContent>
                        {apiTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={() => addCatWithTag(selectedTag, false)} variant="outline" disabled={!selectedTag}>
                      <Tag className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Image with Tag + Text */}
                <div>
                  <label className="text-gray-700 mb-2 block">Cat Image with Tag + Text</label>
                  <div className="flex gap-2">
                    <Select value={comboTag} onValueChange={setComboTag}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Tag..." />
                      </SelectTrigger>
                      <SelectContent>
                        {apiTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Text..."
                      value={comboText}
                      className="flex-1"
                      onChange={(e) => setComboText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCatWithTagAndText(false)}
                    />
                    <Button onClick={() => addCatWithTagAndText(false)} variant="outline" disabled={!comboTag || !comboText}>
                      <Sparkles className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Quick Tags */}
                <div>
                  <label className="text-gray-700 mb-2 block">Quick Tag Selection</label>
                  <div className="flex flex-wrap gap-2">
                    {apiTags.slice(0, 15).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-violet-100 transition-colors"
                        onClick={() => addCatWithTag(tag, false)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={() => clearAll(false)} className="w-full" variant="destructive">
                    <Trash2 className="mr-2 size-4" />
                    Clear All Images
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Images Gallery */}
            {cats.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg">
                <p className="text-gray-500">No cat images yet. Add some using the controls above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cats.map((cat, index) => (
                  <Card key={cat.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-gray-700">Cat #{cats.length - index}</span>
                        <Button size="sm" variant="ghost" onClick={() => refreshItem(cat.id, false)}>
                          <RefreshCw className="size-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <img src={cat.url} alt="Cat" className="w-full h-64 object-cover" />
                    </CardContent>
                    {(cat.text || cat.tag || cat.catId) && (
                      <CardFooter className="pt-4 pb-4">
                        <div className="flex gap-2 flex-wrap">
                          {cat.text && (
                            <Badge variant="secondary">
                              <Type className="size-3 mr-1" />
                              {cat.text}
                            </Badge>
                          )}
                          {cat.tag && (
                            <Badge variant="outline">
                              <Tag className="size-3 mr-1" />
                              {cat.tag}
                            </Badge>
                          )}
                          {cat.catId && (
                            <Badge variant="default">
                              ID: {cat.catId.substring(0, 8)}
                            </Badge>
                          )}
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* GIFs Tab */}
          <TabsContent value="gifs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="size-5" />
                  GIF Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Random GIF */}
                <div>
                  <label className="text-gray-700 mb-2 block">Random Cat GIF</label>
                  <Button onClick={() => addRandomCat(true)} className="w-full">
                    <RefreshCw className="mr-2 size-4" />
                    Get Random Cat GIF
                  </Button>
                </div>

                {/* GIF with Text */}
                <div>
                  <label className="text-gray-700 mb-2 block">Cat GIF with Text</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter text..."
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCatWithText(true)}
                    />
                    <Button onClick={() => addCatWithText(true)} variant="outline">
                      <Type className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* GIF by Tag */}
                <div>
                  <label className="text-gray-700 mb-2 block">Cat GIF by Tag</label>
                  <div className="flex gap-2">
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a tag..." />
                      </SelectTrigger>
                      <SelectContent>
                        {apiTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={() => addCatWithTag(selectedTag, true)} variant="outline" disabled={!selectedTag}>
                      <Tag className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* GIF with Tag + Text */}
                <div>
                  <label className="text-gray-700 mb-2 block">Cat GIF with Tag + Text</label>
                  <div className="flex gap-2">
                    <Select value={comboTag} onValueChange={setComboTag}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Tag..." />
                      </SelectTrigger>
                      <SelectContent>
                        {apiTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Text..."
                      value={comboText}
                      className="flex-1"
                      onChange={(e) => setComboText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCatWithTagAndText(true)}
                    />
                    <Button onClick={() => addCatWithTagAndText(true)} variant="outline" disabled={!comboTag || !comboText}>
                      <Sparkles className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Quick Tags for GIFs */}
                <div>
                  <label className="text-gray-700 mb-2 block">Quick Tag Selection</label>
                  <div className="flex flex-wrap gap-2">
                    {apiTags.slice(0, 15).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-violet-100 transition-colors"
                        onClick={() => addCatWithTag(tag, true)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={() => clearAll(true)} className="w-full" variant="destructive">
                    <Trash2 className="mr-2 size-4" />
                    Clear All GIFs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* GIFs Gallery */}
            {gifs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg">
                <p className="text-gray-500">No cat GIFs yet. Add some using the controls above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gifs.map((gif, index) => (
                  <Card key={gif.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Film className="size-4 text-violet-600" />
                          <span className="text-gray-700">GIF #{gifs.length - index}</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => refreshItem(gif.id, true)}>
                          <RefreshCw className="size-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <img src={gif.url} alt="Cat GIF" className="w-full h-64 object-cover" />
                    </CardContent>
                    {(gif.text || gif.tag) && (
                      <CardFooter className="pt-4 pb-4">
                        <div className="flex gap-2 flex-wrap">
                          {gif.text && (
                            <Badge variant="secondary">
                              <Type className="size-3 mr-1" />
                              {gif.text}
                            </Badge>
                          )}
                          {gif.tag && (
                            <Badge variant="outline">
                              <Tag className="size-3 mr-1" />
                              {gif.tag}
                            </Badge>
                          )}
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Browse Database Tab */}
          <TabsContent value="browse" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Browse Cat Database (via /api/cats)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Showing {allCats.length} cats from the database. Click on any cat to add it to your gallery.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {allCats.map((apiCat) => (
                    <Card
                      key={apiCat._id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => addCatById(apiCat._id)}
                    >
                      <CardContent className="p-0">
                        <img
                          src={`https://cataas.com/cat/${apiCat._id}`}
                          alt="Cat from database"
                          className="w-full h-48 object-cover"
                        />
                      </CardContent>
                      <CardFooter className="pt-3 pb-3">
                        <div className="flex flex-wrap gap-1">
                          {apiCat.tags && apiCat.tags.length > 0 ? (
                            apiCat.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs">No tags</span>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
