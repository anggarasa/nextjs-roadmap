// __tests__/TaskSearch.test.tsx
import { render, screen } from "@testing-library/react";
import { TaskSearchBar } from "@/components/TaskSearchBar";

// Mengisolasi dependensi navigasi Next.js untuk mencegah error 'NextRouter not mounted'
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Komponen UI: TaskSearchBar Navigation", () => {
  it("harus merender input pencarian dengan placeholder yang sesuai", () => {
    render(<TaskSearchBar />);

    // Verifikasi bahwa kolom input hadir dan siap digunakan
    const searchInput = screen.getByPlaceholderText(/cari tugas/i);
    expect(searchInput).toBeInTheDocument();
  });
});
