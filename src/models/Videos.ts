export class Video {
  constructor(
    private id: string,
    private titulo: string,
    private segundos: number,
    private createdAt: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public setId(value: string): void {
    this.id = value;
  }

  public getTitulo(): string {
    return this.titulo;
  }

  public setTitulo(value: string): void {
    this.titulo = value;
  }

  public getSegundos(): number {
    return this.segundos;
  }

  public setSegundos(value: number): void {
    this.segundos = value;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public setCreatedAt(value: string): void {
    this.createdAt = value;
  }
}
