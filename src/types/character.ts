export type RoleNarratif =
  | 'Protagoniste principal'
  | 'Protagoniste secondaire-allié'
  | 'Antagoniste principal'
  | 'Antagoniste secondaire'
  | 'Soutien-mentor';

export type CampMoral = 'Héros' | 'Anti-héros' | 'Vilain' | 'Neutre-ambigu';

export type Genre = 'Homme' | 'Femme' | 'Autre';

export type TrancheAge = 'Enfant' | 'Ado' | 'Jeune adulte' | 'Adulte' | 'Senior';

export type TypeEtre =
  | 'Humain'
  | 'Hybride'
  | 'Démon-Yokai'
  | 'Alien'
  | 'Robot-IA'
  | 'Esprit-Divinité'
  | 'Animal anthropomorphe';

export type CategoriePouvoir =
  | 'Combat physique'
  | 'Pouvoir magique-surnaturel'
  | 'Technologie-arme'
  | 'Intelligence stratégique'
  | 'Aucun pouvoir particulier';

export interface Character {
  id: string;
  nom: string;
  animeSource: string;
  anneeSortieAnime: number;
  roleNarratif: RoleNarratif;
  campMoral: CampMoral;
  genre: Genre;
  trancheAge: TrancheAge;
  typeEtre: TypeEtre;
  categoriePouvoir: CategoriePouvoir;
  couleurCheveux: string;
  imageUrl: string | null;
  descriptionCourte: string;
}
