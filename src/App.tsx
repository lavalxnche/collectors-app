import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CollectionForm, CollectionFormFields } from "./CollectionForm";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { SxProps } from "@mui/system";
import { getUrl } from "aws-amplify/storage";
import ManyCheckboxesForm from "./ManyCheckboxesForm";

const client = generateClient<Schema>();

const fabStyle = {
  position: "absolute",
  top: 72,
  right: 16,
};
const fabSx = fabStyle as SxProps;

function App() {
  const [collections, setCollections] = useState<Array<Schema["Collection"]["type"]>>([]);
  const [photoUrls, setPhotoUrls] = useState<(string | null)[]>([]);
  const [appUser, setAppUser] = useState<Schema["User"]["type"] | null>(null);
  const [version, setVersion] = useState(0);
  const [addCollectionOpen, setAddCollectionOpen] = useState(false);
  const [checkboxesOpen, setCheckboxesOpen] = useState(false);

  const { user: cognitoUser, signOut } = useAuthenticator();

  useEffect(() => {
  client.models.Collection.list({}).then(({ data }) => {
    if (data) {
      setCollections(data);
      const urlPromises = data.map((collection) => {
        return collection.imageUrl ? getUrl({ path: collection.imageUrl }) : null;
      });
      Promise.all(urlPromises).then((urls) => {
        setPhotoUrls(urls.map((url) => (url ? url.url.toString() : null)));
      });
    }
  });
}, [version]);

  useEffect(() => {
    client.models.User.get({ id: cognitoUser.userId }).then(({ data: appUser }) => {
      if (appUser === null) {
        fetchUserAttributes().then((userAttributes) => {
          const createObj = {
            id: cognitoUser.userId,
            username: userAttributes.preferred_username || userAttributes.email || "User",
            bio: "", 
            avatarUrl: "", 
          };
          client.models.User.create(createObj).then(({ data: newUser }) => {
            setAppUser(newUser);
          });
        });
      } else {
        setAppUser(appUser);
      }
    });
  }, [cognitoUser]);

  function handleAddCollectionClose(data: CollectionFormFields | null) {
    if (appUser && data) {
      if (data.title && data.filename) {
        client.models.Collection.create({
          title: data.title, 
          description: data.description || "", 
          imageUrl: data.filename, 
          ownerId: appUser.id, 
          createdAt: new Date().toISOString(), 
        }).then(() => setVersion(version + 1));
        setAddCollectionOpen(false);
      } else {
        alert("You must supply a title and photo file");
      }
    } else {
      setAddCollectionOpen(false);
    }
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Collection
            </Typography>
            <Button color="inherit" onClick={() => setCheckboxesOpen(true)}>
              Checkboxes
            </Button>
            <Button color="inherit" onClick={signOut}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container spacing={2} sx={{ m: 2 }}>
          {collections.map((collection, i) => {
            return (
              <Grid key={collection.id} size={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}>
                <Card>
                  {photoUrls[i] ? (
                    <CardMedia
                      sx={{ height: 140 }}
                      image={photoUrls[i]}
                      title={collection.title || "collection title"}
                    />
                  ) : null}
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {collection.title} {}
                    </Typography>
                    {collection.description && (
                      <Typography variant="body2" color="text.secondary">
                        {collection.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <CollectionForm open={addCollectionOpen} handleClose={handleAddCollectionClose} userId={""} />

      <Fab
        color="secondary"
        aria-label="add"
        sx={fabSx}
        onClick={() => setAddCollectionOpen(true)}
      >
        <AddIcon />
      </Fab>

      <ManyCheckboxesForm open={checkboxesOpen} handleClose={() => setCheckboxesOpen(false)} />
    </>
  );
}

export default App;

